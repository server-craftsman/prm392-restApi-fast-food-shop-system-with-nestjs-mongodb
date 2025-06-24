import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Product } from '../../domain/product';
import { Category } from '../../../categories/domain/category';
import { FilterProductDto, SortProductDto } from '../../dto/query-product.dto';

export abstract class ProductRepository {
  // Create a new product
  abstract create(
    data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Product>;

  // Find products with pagination, filtering, and sorting
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Product[]>;

  // Find a product by its ID
  abstract findById(id: Product['id']): Promise<NullableType<Product>>;

  // Find multiple products by their IDs
  abstract findByIds(ids: Product['id'][]): Promise<Product[]>;

  // Find all products belonging to a specific category
  abstract findByCategoryId(categoryId: Category['id']): Promise<Product[]>;

  // Find all products belonging to multiple categories
  abstract findByCategoryIds(categoryIds: Category['id'][]): Promise<Product[]>;

  // Count products in a specific category
  abstract countByCategoryId(categoryId: Category['id']): Promise<number>;

  // Update a product by its ID
  abstract update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<Product | null>;

  // Remove a product by its ID
  abstract remove(id: Product['id']): Promise<void>;

  // Remove all products in a specific category (e.g., when a category is deleted)
  abstract removeByCategoryId(categoryId: Category['id']): Promise<void>;

  // Update categoryId for all products in a category (e.g., when merging categories)
  abstract updateCategoryForProducts(
    oldCategoryId: Category['id'],
    newCategoryId: Category['id'],
  ): Promise<void>;

  // Find products by category name (for convenience)
  abstract findByCategoryName(
    categoryName: Category['name'],
  ): Promise<Product[]>;

  // Find all categories that have at least one product
  abstract findCategoriesWithProducts(): Promise<Category[]>;
}
