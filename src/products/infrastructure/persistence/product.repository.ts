import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Product } from '../../domain/product';
import { FilterProductDto, SortProductDto } from '../../dto/query-product.dto';

export abstract class ProductRepository {
    abstract create(
        data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Product>;

    abstract findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null;
        sortOptions?: SortProductDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Product[]>;

    abstract findById(id: Product['id']): Promise<NullableType<Product>>;
    abstract findByIds(ids: Product['id'][]): Promise<Product[]>;

    abstract update(
        id: Product['id'],
        payload: DeepPartial<Product>,
    ): Promise<Product | null>;

    abstract remove(id: Product['id']): Promise<void>;
}