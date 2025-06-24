import { Cart } from '../../domain/cart';

export abstract class CartRepository {
  abstract findByUserId(userId: string): Promise<Cart | null>;
  abstract create(userId: string): Promise<Cart>;
  abstract addProduct(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart>;
  abstract updateProductQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart>;
  abstract removeProduct(
    userId: string,
    productId: string,
  ): Promise<Cart | null>;
  abstract clear(userId: string): Promise<void>;
  abstract findById(id: string): Promise<Cart | null>;
}
