import { Injectable } from '@nestjs/common';
import { CartRepository } from './infrastructure/persistence/cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { FilterCartDto, SortCartDto } from './dto/query-cart.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class CartItemsService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findAll() {
    return this.cartRepository.findAll();
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCartDto | null;
    sortOptions?: SortCartDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    return this.cartRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async getCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      // Or create one if it doesn't exist
      cart = await this.cartRepository.create(userId);
    }
    return cart;
  }

  async getMyCartWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: string;
    paginationOptions: IPaginationOptions;
  }) {
    // For cart items, we need to implement pagination on the cart items
    // Since each user has one cart, we get the cart and then paginate the items
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      // Create empty cart if it doesn't exist
      const newCart = await this.cartRepository.create(userId);
      return {
        cart: newCart,
        hasNextPage: false,
        totalItems: 0,
      };
    }

    const { page, limit } = paginationOptions;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const totalItems = cart.items?.length || 0;
    const paginatedItems = cart.items?.slice(startIndex, endIndex) || [];
    const hasNextPage = endIndex < totalItems;

    return {
      cart: {
        ...cart,
        items: paginatedItems,
      },
      hasNextPage,
      totalItems,
    };
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
