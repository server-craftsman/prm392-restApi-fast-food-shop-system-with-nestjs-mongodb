import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './infrastructure/persistence/cart.repository';
import { Cart } from './domain/cart';

function generateCartNo() {
  return 'CART-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

@Injectable()
export class CartsService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepository.findByUserId(userId);
  }

  async create(userId: string, data?: Partial<Cart>): Promise<Cart> {
    const cartToCreate: Partial<Cart> = {
      userId,
      ...data,
      cartNo: data?.cartNo || generateCartNo(),
      status: data?.status || 'pending',
    };
    return this.cartRepository.create(cartToCreate);
  }

  async update(id: string, data: Partial<Cart>): Promise<Cart> {
    const updated = await this.cartRepository.update(id, data);
    if (!updated) throw new NotFoundException('Cart not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    await this.cartRepository.delete(id);
  }
}
