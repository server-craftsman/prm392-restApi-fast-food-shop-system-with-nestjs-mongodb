import { Cart, CartItem } from '../../../../domain/cart';
import { CartSchemaClass } from '../entities/cart.schema';

export class CartMapper {
  static toDomain(entity: CartSchemaClass): Cart {
    const cart = new Cart();
    cart.id = (entity as any)._id.toString();
    cart.userId = entity.userId.toString();
    cart.isActive = entity.isActive;
    cart.items = entity.items.map((item) => {
      const cartItem = new CartItem();
      cartItem.productId = item.productId.toString();
      cartItem.quantity = item.quantity;
      return cartItem;
    });
    cart.createdAt = (entity as any).createdAt;
    cart.updatedAt = (entity as any).updatedAt;
    return cart;
  }
}
