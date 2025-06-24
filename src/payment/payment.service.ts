import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Payment } from './domain/payment';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ZaloPaymentDto } from './dto/zalopay-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { PaymentStatus, PaymentMethod } from './payment-enum';
import { OrderService } from '../order/orders.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) { }

  // ZaloPay configuration (should be in environment variables)
  private readonly zaloPayConfig = {
    appId: process.env.ZALOPAY_APP_ID || '2553',
    key1: process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint:
      process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create',
  };

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }

  async createPayment(
    userId: string,
    data: CreatePaymentDto,
  ): Promise<Payment> {
    // Check if payment already exists for this order
    const existingPayments = await this.paymentRepository.findByOrderId(data.orderId);
    const existingPayment = existingPayments.find(
      payment => payment.status === PaymentStatus.PAID || payment.status === PaymentStatus.PENDING
    );

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Generate unique transaction ID
    const transactionId = this.generateTransactionId();

    const paymentData = {
      orderId: data.orderId,
      userId: userId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionId,
      status: PaymentStatus.PENDING,
      description: data.description,
    };

    return this.paymentRepository.create(paymentData);
  }

  async payByCash(
    userId: string,
    orderId: string,
    description?: string,
  ): Promise<Payment> {
    // check orderId has the same userId
    const order = await this.orderService.findOne(orderId);
    if (order.userId.toString() !== userId) {
      throw new BadRequestException('Order does not belong to user');
    }

    // Check if order is already paid
    const existingPayments = await this.paymentRepository.findByOrderId(orderId);
    const existingPayment = existingPayments.find(
      payment => payment.status === PaymentStatus.PAID
    );

    if (existingPayment) {
      throw new BadRequestException('Order already paid');
    }

    // For cash payments, we need to get the order amount first
    const amount = await this.getOrderAmount(orderId);

    const paymentData: CreatePaymentDto = {
      orderId,
      paymentMethod: PaymentMethod.CASH,
      amount,
      description: description || 'Cash payment',
    };

    const payment = await this.createPayment(userId, paymentData);

    // For cash payments, mark as paid immediately
    return this.updatePaymentStatus(payment.id, PaymentStatus.PAID);
  }

  async payByZaloPay(
    userId: string,
    data: ZaloPaymentDto,
  ): Promise<{ paymentUrl: string; payment: Payment }> {
    // Get order amount
    const amount = await this.getOrderAmount(data.orderId);

    // Create payment record
    const paymentData: CreatePaymentDto = {
      orderId: data.orderId,
      paymentMethod: PaymentMethod.ZALOPAY,
      amount,
      description: data.description || 'ZaloPay payment',
    };

    const payment = await this.createPayment(userId, paymentData);

    // Create ZaloPay order
    const zaloPayOrder = await this.createZaloPayOrder(payment, data.returnUrl);

    // Update payment with ZaloPay details
    const updatedPayment = await this.paymentRepository.update(payment.id, {
      paymentUrl: zaloPayOrder.orderUrl,
      zaloPayOrderId: zaloPayOrder.orderId,
    });

    return {
      paymentUrl: zaloPayOrder.orderUrl,
      payment: updatedPayment || payment,
    };
  }

  async handleZaloPayCallback(
    data: PaymentCallbackDto,
  ): Promise<Payment> {
    // Find payment by ZaloPay order ID
    const payment = await this.paymentRepository.findByZaloPayOrderId(data.orderId);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status based on ZaloPay response
    const newStatus =
      data.status === 1 ? PaymentStatus.PAID : PaymentStatus.FAILED;

    const updatedPayment = await this.paymentRepository.update(payment.id, {
      status: newStatus,
      transactionId: data.transactionId,
    });

    return updatedPayment || payment;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
  ): Promise<Payment> {
    const updatedPayment = await this.paymentRepository.update(paymentId, { status });

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async cancelPayment(paymentId: string): Promise<Payment> {
    return this.updatePaymentStatus(paymentId, PaymentStatus.CANCELLED);
  }

  private createZaloPayOrder(
    payment: Payment,
    returnUrl?: string,
  ): Promise<{ orderUrl: string; orderId: string }> {
    const embedData = JSON.stringify({
      redirecturl: returnUrl || 'https://your-app.com/payment/success',
    });

    const items = JSON.stringify([
      {
        itemid: payment.orderId.toString(),
        itemname: 'Order Payment',
        itemprice: payment.amount,
        itemquantity: 1,
      },
    ]);

    const order = {
      app_id: this.zaloPayConfig.appId,
      app_trans_id: payment.transactionId,
      app_user: payment.userId.toString(),
      app_time: Date.now(),
      item: items,
      embed_data: embedData,
      amount: payment.amount,
      description: payment.description || 'Payment for order',
      bank_code: '',
      callback_url:
        process.env.ZALOPAY_CALLBACK_URL ||
        'https://your-api.com/payment/zalopay/callback',
    };

    // Create MAC for authentication
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order['mac'] = crypto
      .createHmac('sha256', this.zaloPayConfig.key1)
      .update(data)
      .digest('hex');

    // For now, return a mock response since we don't have axios installed
    // In a real implementation, you would use axios to call ZaloPay API
    return Promise.resolve({
      orderUrl: `https://sandbox.zalopay.com.vn/v2/mock/payment?app_trans_id=${order.app_trans_id}`,
      orderId: order.app_trans_id,
    });

    // Real implementation would be:
    // try {
    //   const response = await axios.post(this.zaloPayConfig.endpoint, null, { params: order });
    //
    //   if (response.data.return_code === 1) {
    //     return {
    //       orderUrl: response.data.order_url,
    //       orderId: order.app_trans_id,
    //     };
    //   } else {
    //     throw new BadRequestException('Failed to create ZaloPay order: ' + response.data.return_message);
    //   }
    // } catch {
    //   throw new BadRequestException('ZaloPay integration error');
    // }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `PAY_${timestamp}_${random}`.toUpperCase();
  }

  private async getOrderAmount(orderId: string): Promise<number> {
    try {
      if (this.orderService && this.orderService.findOne) {
        const order = await this.orderService.findOne(orderId);
        return order.total;
      }
      // Fallback if order service is not available
      return 100000; // Default amount in VND
    } catch {
      // If order not found or service unavailable, throw error
      throw new NotFoundException(
        'Order not found or order service unavailable',
      );
    }
  }
}
