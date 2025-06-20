import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './domain/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(data: Partial<Order>): Promise<Order> {
    const created = new this.orderModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const updated = await this.orderModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.orderModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Order not found');
  }
}
