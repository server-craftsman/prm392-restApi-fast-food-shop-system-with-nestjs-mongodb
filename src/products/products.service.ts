import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto, SortProductDto } from './dto/query-product.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Product } from './domain/product';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Product[]> {
    return this.productRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: CreateProductDto) {
    return this.productRepository.create(data);
  }

  async update(id: string, data: UpdateProductDto) {
    const updated = await this.productRepository.update(id, data);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async delete(id: string) {
    await this.productRepository.remove(id);
  }
}
