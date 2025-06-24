import { Types } from 'mongoose';
import { Order, OrderItems } from '../../../../domain/order';
import { OrderSchemaClass } from '../entities/orders.schema';

export class OrderMapper {
  static toDomain(domainEntity: OrderSchemaClass): Order {
    const order = new Order();
    order.id = (domainEntity as any)._id.toString();
    order.items = domainEntity.items.map((item) => {
      const orderItem = new OrderItems();
      orderItem.productId = item.productId
        ? item.productId.toString()
        : undefined;
      orderItem.productName = item.productName;
      orderItem.price = item.price;
      orderItem.quantity = item.quantity;
      orderItem.notes = item.notes;
      return orderItem;
    });
    order.cartId = domainEntity.cartId
      ? domainEntity.cartId.toString()
      : new Types.ObjectId().toString();
    order.userId = domainEntity.userId.toString();
    order.total = domainEntity.total;
    order.status = domainEntity.status;
    order.notes = domainEntity.notes;
    order.createdAt = domainEntity.createdAt;
    order.updatedAt = domainEntity.updatedAt;
    order.deletedAt = domainEntity.deletedAt;
    return order;
  }

  static toPersistence(domainEntity: Order): any {
    return {
      items: domainEntity.items.map((item) => ({
        productId: item.productId
          ? new Types.ObjectId(item.productId)
          : undefined,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes,
      })),
      cartId: new Types.ObjectId(domainEntity.cartId),
      userId: new Types.ObjectId(domainEntity.userId),
      total: domainEntity.total,
      status: domainEntity.status,
      notes: domainEntity.notes,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
