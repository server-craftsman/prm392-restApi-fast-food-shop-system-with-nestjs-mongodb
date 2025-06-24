import { Injectable } from '@nestjs/common';
import { Order } from '../../../../domain/order';
import { OrderRepository } from '../../order.repository';
import { OrderSchemaClass } from '../entities/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMapper } from '../mappers/orders.mapper';

@Injectable()
export class OrdersDocumentRepository implements OrderRepository {
  constructor(
    @InjectModel(OrderSchemaClass.name)
    private orderModel: Model<OrderSchemaClass>,
  ) {}

  async create(userId: string, order: Order): Promise<Order> {
    const orderWithUserId = { ...order, userId };
    const orderDocument = await this.orderModel.create(
      OrderMapper.toPersistence(orderWithUserId),
    );
    return OrderMapper.toDomain(orderDocument);
  }

  async update(
    userId: string,
    id: Order['id'],
    data: Partial<Order>,
  ): Promise<Order> {
    const updateData = { ...data, userId };
    const orderDocument = await this.orderModel.findByIdAndUpdate(
      id,
      OrderMapper.toPersistence(updateData as Order),
      { new: true },
    );

    if (!orderDocument) {
      throw new Error('Order not found');
    }

    return OrderMapper.toDomain(orderDocument);
  }

  async delete(userId: string, id: Order['id']): Promise<void> {
    await this.orderModel.findByIdAndDelete(id);
  }

  async findById(id: Order['id']): Promise<Order> {
    const orderDocument = await this.orderModel.findById(id);

    if (!orderDocument) {
      throw new Error('Order not found');
    }

    return OrderMapper.toDomain(orderDocument);
  }

  async findAll(): Promise<Order[]> {
    const orderDocuments = await this.orderModel.find();
    return orderDocuments.map((doc) => OrderMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orderDocuments = await this.orderModel.find({ userId });
    return orderDocuments.map((doc) => OrderMapper.toDomain(doc));
  }
}
