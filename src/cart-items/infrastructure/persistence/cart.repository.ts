import { Cart } from '../../domain/cart';
import { FilterCartDto, SortCartDto } from '../../dto/query-cart.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

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

  abstract findAll(): Promise<Cart[]>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCartDto | null;
    sortOptions?: SortCartDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Cart[]>;
}
