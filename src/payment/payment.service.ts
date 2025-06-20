import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './domain/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    const created = new this.paymentModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const updated = await this.paymentModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Payment not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Payment not found');
  }

  async payByCash(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.create({ ...createPaymentDto, paymentMethod: 'cash' });
  }

  async payByPayOs(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.create({ ...createPaymentDto, paymentMethod: 'pay_os' });
  }
}
