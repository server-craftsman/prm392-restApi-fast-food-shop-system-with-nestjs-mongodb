import { Injectable } from '@nestjs/common';
import { CartRepository } from './infrastructure/persistence/cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      // Or create one if it doesn't exist
      cart = await this.cartRepository.create(userId);
    }
    return cart;
  }

  async getCartById(cartId: string) {
    return this.cartRepository.findById(cartId);
  }

  async addItemToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;
    const cart = await this.cartRepository.findByUserId(userId);

    // If cart exists, check for item and update quantity or add new item
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId,
      );
      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        return this.cartRepository.updateProductQuantity(
          userId,
          productId,
          newQuantity,
        );
      } else {
        return this.cartRepository.addProduct(userId, productId, quantity);
      }
    } else {
      // If no cart, this will create a cart and add the product.
      return this.cartRepository.addProduct(userId, productId, quantity);
    }
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;
    if (quantity <= 0) {
      return this.removeItemFromCart(userId, productId);
    }
    return this.cartRepository.updateProductQuantity(
      userId,
      productId,
      quantity,
    );
  }

  async removeItemFromCart(userId: string, productId: string) {
    return this.cartRepository.removeProduct(userId, productId);
  }

  async clearCart(userId: string) {
    await this.cartRepository.clear(userId);
    return this.getCart(userId);
  }
}
