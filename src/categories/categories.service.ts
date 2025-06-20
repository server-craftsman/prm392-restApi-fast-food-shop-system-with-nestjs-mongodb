import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FilterCategoryDto, SortCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.create(
      createCategoryDto as Category,
    );
    return category;
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCategoryDto | null;
    sortOptions?: SortCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    return this.categoryRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: Category['id']): Promise<NullableType<Category>> {
    return this.categoryRepository.findById(id);
  }

  findByIds(ids: Category['id'][]): Promise<Category[]> {
    return this.categoryRepository.findByIds(ids);
  }

  findByCategoryName(categoryName: string): Promise<NullableType<Category>> {
    return this.categoryRepository.findByName(categoryName);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.update(
      id,
      updateCategoryDto as Category,
    );
    return category as Category;
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.remove(id);
  }
}
