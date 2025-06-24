import { Cart } from '../../../../domain/cart';
import { CartsSchemaClass } from '../entities/carts.schema';
import { Types } from 'mongoose';

// mapper dùng để chuyển đổi dữ liệu từ domain sang persistence và ngược lại
export class CartMapper {
  static toDomain(raw: CartsSchemaClass): Cart {
    const domainEntity = new Cart();
    domainEntity.id = raw._id?.toString() ?? raw.id;
    domainEntity.cartNo = raw.cartNo;
    domainEntity.status = raw.status;
    domainEntity.userId = raw.userId?.toString() ?? raw.userId;
    domainEntity.createdAt = raw.createdAt ?? new Date();
    domainEntity.updatedAt = raw.updatedAt ?? new Date();
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(cart: Cart): CartsSchemaClass {
    const schema = new CartsSchemaClass();
    schema.cartNo = cart.cartNo;
    schema.status = cart.status;
    if (cart.userId) {
      schema.userId = new Types.ObjectId(cart.userId);
    }
    schema.createdAt = cart.createdAt;
    schema.updatedAt = cart.updatedAt;
    schema.deletedAt = cart.deletedAt;
    return schema;
  }
}
