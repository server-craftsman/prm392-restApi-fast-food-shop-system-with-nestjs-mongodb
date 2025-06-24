import { Cart } from '../../domain/cart';

export abstract class CartRepository {
  abstract create(data: Partial<Cart>): Promise<Cart>;
  abstract findById(id: string): Promise<Cart | null>;
  abstract findByUserId(userId: string): Promise<Cart | null>;
  abstract update(id: string, data: Partial<Cart>): Promise<Cart | null>;
  abstract delete(id: string): Promise<void>;
}
