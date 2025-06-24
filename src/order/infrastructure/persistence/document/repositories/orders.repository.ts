import { Injectable } from '@nestjs/common';
import { Order } from '../../../../domain/order';
import { OrderRepository } from '../../order.repository';
import { OrderSchemaClass } from '../entities/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { OrderMapper } from '../mappers/orders.mapper';
import { FilterOrderDto, SortOrderDto } from '../../../../dto/query-order.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

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

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterOrderDto | null;
    sortOptions?: SortOrderDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Order[]> {
    const where: FilterQuery<OrderSchemaClass> = {};

    if (filterOptions?.userId) {
      where['userId'] = new Types.ObjectId(filterOptions.userId);
    }

    if (filterOptions?.cartId) {
      where['cartId'] = new Types.ObjectId(filterOptions.cartId);
    }

    if (filterOptions?.statuses?.length) {
      where['status'] = { $in: filterOptions.statuses };
    }

    if (
      filterOptions?.minTotal !== undefined ||
      filterOptions?.maxTotal !== undefined
    ) {
      where['total'] = {};
      if (filterOptions.minTotal !== undefined) {
        where['total']['$gte'] = filterOptions.minTotal;
      }
      if (filterOptions.maxTotal !== undefined) {
        where['total']['$lte'] = filterOptions.maxTotal;
      }
    }

    if (filterOptions?.notesSearch) {
      where['notes'] = { $regex: filterOptions.notesSearch, $options: 'i' };
    }

    const orderDocuments = await this.orderModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.field === 'id' ? '_id' : sort.field]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .exec();

    return orderDocuments.map((doc) => OrderMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orderDocuments = await this.orderModel.find({ userId });
    return orderDocuments.map((doc) => OrderMapper.toDomain(doc));
  }
}
