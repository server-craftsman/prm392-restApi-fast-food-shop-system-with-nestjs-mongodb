import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItem } from './domain/orderitem.schema';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemModel.find().exec();
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.findById(id).exec();
    if (!orderItem) throw new NotFoundException('OrderItem not found');
    return orderItem;
  }

  async create(data: Partial<OrderItem>): Promise<OrderItem> {
    const created = new this.orderItemModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    const updated = await this.orderItemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('OrderItem not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.orderItemModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('OrderItem not found');
  }
}
