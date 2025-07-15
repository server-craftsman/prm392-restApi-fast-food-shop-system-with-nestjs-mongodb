import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto, SortProductDto } from './dto/query-product.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Product } from './domain/product';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly filesService: FilesService,
  ) { }

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
    // Handle image IDs by fetching the actual file data
    if (data.images && data.images.length > 0) {
      const imageIds = data.images.map(img => img.id);
      const files = await this.filesService.findByIds(imageIds);

      // Replace the image IDs with actual file objects
      const productData: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'> = {
        ...data,
        images: files,
      };

      return this.productRepository.create(productData);
    }

    const productData: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'> = {
      ...data,
      images: [],
    };

    return this.productRepository.create(productData);
  }

  async update(id: string, data: UpdateProductDto) {
    // Handle image IDs by fetching the actual file data
    if (data.images && data.images.length > 0) {
      const imageIds = data.images.map(img => img.id);
      const files = await this.filesService.findByIds(imageIds);

      // Replace the image IDs with actual file objects
      const productData = {
        ...data,
        images: files,
      };

      const updated = await this.productRepository.update(id, productData);
      if (!updated) throw new NotFoundException('Product not found');
      return updated;
    }

    const updated = await this.productRepository.update(id, data);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async delete(id: string) {
    await this.productRepository.remove(id);
  }

  async removeByCategoryId(categoryId: string) {
    await this.productRepository.removeByCategoryId(categoryId);
  }

  async updateCategoryForProducts(
    oldCategoryId: string,
    newCategoryId: string,
  ) {
    await this.productRepository.updateCategoryForProducts(
      oldCategoryId,
      newCategoryId,
    );
  }

  async findByCategoryName(categoryName: string) {
    const products =
      await this.productRepository.findByCategoryName(categoryName);
    if (!products || products.length === 0)
      throw new NotFoundException('Category or products not found');
    return products;
  }

  async findCategoriesWithProducts() {
    const categories =
      await this.productRepository.findCategoriesWithProducts();
    if (!categories || categories.length === 0)
      throw new NotFoundException('No categories with products found');
    return categories;
  }

  async findByCategoryId(categoryId: string) {
    const products = await this.productRepository.findByCategoryId(categoryId);
    if (!products || products.length === 0)
      throw new NotFoundException('No products found for this category');
    return products;
  }
}
