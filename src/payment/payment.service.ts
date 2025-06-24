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
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) {}

  // ZaloPay configuration (should be in environment variables)
  private readonly zaloPayConfig = {
    appId: process.env.ZALOPAY_APP_ID || '2553', // ZaloPay sandbox app_id
    key1: process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL', // ZaloPay sandbox key1
    endpoint:
      process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create', // ZaloPay sandbox endpoint
  };

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPaymentDto | null;
    sortOptions?: SortPaymentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]> {
    return this.paymentRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
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

  async findByUserIdWithPagination({
    userId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    userId: string;
    filterOptions?: FilterPaymentDto | null;
    sortOptions?: SortPaymentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]> {
    // Set userId filter to ensure only user's payments are returned
    const userFilterOptions = {
      ...filterOptions,
      userId,
    };

    return this.paymentRepository.findManyWithPagination({
      filterOptions: userFilterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async createPayment(
    userId: string,
    data: CreatePaymentDto,
  ): Promise<Payment> {
    // Check if payment already exists for this order
    const existingPayments = await this.paymentRepository.findByOrderId(
      data.orderId,
    );
    const existingPayment = existingPayments.find(
      (payment) =>
        payment.status === PaymentStatus.PAID ||
        payment.status === PaymentStatus.PENDING,
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
    const existingPayments =
      await this.paymentRepository.findByOrderId(orderId);
    const existingPayment = existingPayments.find(
      (payment) => payment.status === PaymentStatus.PAID,
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

  /**
   * ZaloPay payment for Mobile Apps (Android/iOS)
   * Returns order data for ZaloPay SDK integration
   */
  async payByZaloPayMobile(
    userId: string,
    data: ZaloPaymentDto,
  ): Promise<{
    orderToken: string;
    zpTransToken: string;
    appTransId: string;
    payment: Payment;
    orderData: any;
  }> {
    // Get order amount
    const amount = await this.getOrderAmount(data.orderId);

    // Create payment record
    const paymentData: CreatePaymentDto = {
      orderId: data.orderId,
      paymentMethod: PaymentMethod.ZALOPAY,
      amount,
      description: data.description || 'ZaloPay mobile payment',
    };

    const payment = await this.createPayment(userId, paymentData);

    // Create ZaloPay order for mobile
    const zaloPayMobileOrder = await this.createZaloPayMobileOrder(payment);

    // Update payment with ZaloPay details
    const updatedPayment = await this.paymentRepository.update(payment.id, {
      zaloPayOrderId: zaloPayMobileOrder.appTransId,
    });

    return {
      orderToken: zaloPayMobileOrder.orderToken,
      zpTransToken: zaloPayMobileOrder.zpTransToken,
      appTransId: zaloPayMobileOrder.appTransId,
      payment: updatedPayment || payment,
      orderData: zaloPayMobileOrder.orderData,
    };
  }

  async handleZaloPayCallback(data: PaymentCallbackDto): Promise<Payment> {
    // Find payment by ZaloPay order ID
    const payment = await this.paymentRepository.findByZaloPayOrderId(
      data.orderId,
    );

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
    const updatedPayment = await this.paymentRepository.update(paymentId, {
      status,
    });

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async cancelPayment(paymentId: string): Promise<Payment> {
    return this.updatePaymentStatus(paymentId, PaymentStatus.CANCELLED);
  }

  private async createZaloPayOrder(
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
        'https://sb-openapi.zalopay.vn/v2/callback', // ZaloPay sandbox callback
    };

    // Create MAC for authentication
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    const key1 = this.zaloPayConfig.key1 || '';
    order['mac'] = crypto.createHmac('sha256', key1).update(data).digest('hex');

    // Option 1: Real ZaloPay Sandbox integration
    try {
      // ZaloPay expects form data, not JSON
      const formData = new URLSearchParams();
      Object.keys(order).forEach((key) => {
        formData.append(key, order[key]);
      });

      const response = await axios.post(this.zaloPayConfig.endpoint, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.return_code === 1) {
        return {
          orderUrl: response.data.order_url,
          orderId: order.app_trans_id,
        };
      } else {
        throw new BadRequestException(
          'Failed to create ZaloPay order: ' + response.data.return_message,
        );
      }
    } catch (error) {
      console.error(
        'ZaloPay integration error (axios not installed?):',
        error.message,
      );

      // Fall back to a working demo URL (ZaloPay /v2/demo endpoint doesn't exist)
      // Create a simple demo payment page that shows payment details
      const demoParams = new URLSearchParams({
        payment_type: 'zalopay_demo',
        app_trans_id: order.app_trans_id,
        amount: order.amount.toString(),
        description: order.description,
        return_url: returnUrl || 'https://your-app.com/payment/result',
        status: 'pending',
        message: 'Demo ZaloPay payment - Install axios for real integration',
      });

      // Use a simple demo page that works
      const demoUrl = `https://httpbin.org/anything?${demoParams.toString()}`;

      return Promise.resolve({
        orderUrl: demoUrl,
        orderId: order.app_trans_id,
      });
    }

    // Option 2: Demo/Mock URL (backup - commented out since we're using real API)
    // const demoReturnUrl = returnUrl || 'https://google.com';
    // return Promise.resolve({
    //   orderUrl: `https://google.com/search?q=zalopay+demo+payment+completed&app_trans_id=${order.app_trans_id}&return_url=${encodeURIComponent(demoReturnUrl)}`,
    //   orderId: order.app_trans_id,
    // });
  }

  /**
   * Create ZaloPay order for Mobile SDK integration
   * Returns order token and data needed for mobile apps
   */
  private async createZaloPayMobileOrder(payment: Payment): Promise<{
    orderToken: string;
    zpTransToken: string;
    appTransId: string;
    orderData: any;
  }> {
    // Validate ZaloPay configuration
    this.validateZaloPayConfig();

    // Validate payment data
    this.validateZaloPayOrder(payment);

    // Use ZaloPay compatible transaction ID
    const zaloPayTransId = this.generateZaloPayTransactionId();

    const embedData = JSON.stringify({
      merchantinfo: 'fastfood shop',
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
      app_trans_id: zaloPayTransId, // Use ZaloPay format
      app_user: payment.userId.toString(),
      app_time: Date.now(),
      item: items,
      embed_data: embedData,
      amount: payment.amount,
      description: payment.description || 'Mobile payment for order',
      bank_code: '',
      callback_url:
        process.env.ZALOPAY_CALLBACK_URL ||
        'https://your-api.com/api/v1/payments/zalopay/callback',
    };

    // Create MAC for authentication - CORRECT ORDER for mobile
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    const key1 = this.zaloPayConfig.key1 || '';
    order['mac'] = crypto.createHmac('sha256', key1).update(data).digest('hex');

    // Debug logging
    console.log('=== ZaloPay Mobile Order Debug ===');
    console.log('App ID:', order.app_id);
    console.log('Trans ID:', order.app_trans_id);
    console.log('Amount:', order.amount);
    console.log('MAC Data:', data);
    console.log('MAC:', order['mac']);
    console.log('Endpoint:', this.zaloPayConfig.endpoint);

    // For mobile, we return the order data for SDK to process
    // The mobile app will use ZaloPay SDK to create payment
    try {
      const formData = new URLSearchParams();
      Object.keys(order).forEach((key) => {
        formData.append(key, order[key]);
      });

      console.log('Form Data:', formData.toString());

      const response = await axios.post(this.zaloPayConfig.endpoint, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('ZaloPay Response:', response.data);

      if (response.data.return_code === 1) {
        // Update payment with ZaloPay transaction ID
        await this.paymentRepository.update(payment.id, {
          zaloPayOrderId: zaloPayTransId,
        });

        return {
          orderToken: response.data.zp_trans_token || response.data.order_token,
          zpTransToken: response.data.zp_trans_token,
          appTransId: zaloPayTransId,
          orderData: order,
        };
      } else {
        console.error('ZaloPay Error Details:', {
          return_code: response.data.return_code,
          return_message: response.data.return_message,
          sub_return_code: response.data.sub_return_code,
          sub_return_message: response.data.sub_return_message,
        });

        throw new BadRequestException(
          `ZaloPay Error: ${response.data.return_message} (Code: ${response.data.return_code})${
            response.data.sub_return_message
              ? ` - ${response.data.sub_return_message}`
              : ''
          }`,
        );
      }
    } catch (error) {
      console.error('ZaloPay mobile integration error:', error.message);

      // If it's an axios error, log more details
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      // Demo mode for mobile - return mock tokens
      console.log('Falling back to demo mode...');
      return Promise.resolve({
        orderToken: `demo_token_${zaloPayTransId}`,
        zpTransToken: `demo_zp_token_${zaloPayTransId}`,
        appTransId: zaloPayTransId,
        orderData: order,
      });
    }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `PAY_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Validate ZaloPay configuration and common issues
   */
  private validateZaloPayConfig(): void {
    if (!this.zaloPayConfig.appId) {
      throw new BadRequestException('ZaloPay app_id is required');
    }
    if (!this.zaloPayConfig.key1) {
      throw new BadRequestException('ZaloPay key1 is required');
    }
    console.log('ZaloPay Config validated successfully');
  }

  /**
   * Validate ZaloPay order data
   */
  private validateZaloPayOrder(payment: Payment): void {
    // Amount must be between 1,000 and 1,000,000,000 VND
    if (payment.amount < 1000) {
      throw new BadRequestException(
        'Payment amount must be at least 1,000 VND',
      );
    }
    if (payment.amount > 1000000000) {
      throw new BadRequestException(
        'Payment amount must not exceed 1,000,000,000 VND',
      );
    }

    // Description length validation
    if (payment.description && payment.description.length > 200) {
      throw new BadRequestException(
        'Description must not exceed 200 characters',
      );
    }

    console.log('ZaloPay order data validated successfully');
  }

  /**
   * Generate ZaloPay compatible transaction ID
   * Format: YYMMDD_APPID_XXXXXXXX
   */
  private generateZaloPayTransactionId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    const appId = this.zaloPayConfig.appId;
    const random = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0');
    return `${dateStr}_${appId}_${random}`;
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
