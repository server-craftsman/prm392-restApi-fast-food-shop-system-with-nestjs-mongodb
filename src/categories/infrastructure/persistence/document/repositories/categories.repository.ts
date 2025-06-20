import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CategorySchemaClass } from '../entities/categories.schema';
import { Category } from '../../../../domain/category';
import { CategoryMapper } from '../mappers/categories.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import {
  FilterCategoryDto,
  SortCategoryDto,
} from '../../../../dto/query-category.dto';
import { CategoryRepository } from '../../category.repository';

@Injectable()
export class CategoryDocumentRepository implements CategoryRepository {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaClass>,
  ) {}

  async create(data: Category): Promise<Category> {
    const persistence = CategoryMapper.toPersistence(data);
    const created = new this.categoryModel(persistence);
    const doc = await created.save();
    return CategoryMapper.toDomain(doc);
  }

  async findManyWithPagination({
    // filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCategoryDto | null;
    sortOptions?: SortCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    const where: FilterQuery<CategorySchemaClass> = {};
    const categoryObjects = await this.categoryModel
      .find(where)
      .sort(
        sortOptions?.reduce((acc, sortOption) => {
          acc[sortOption?.field || 'createdAt'] = sortOption.order;
          return acc;
        }, {} as any) || { createdAt: -1 },
      )
      .select('-__v')
      .lean()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return categoryObjects.map((userObject) =>
      CategoryMapper.toDomain(userObject),
    );
  }

  async findAll(): Promise<Category[]> {
    const docs = await this.categoryModel.find().exec();
    return docs.map((doc) => CategoryMapper.toDomain(doc));
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const doc = await this.categoryModel.findById(id).exec();
    return doc ? CategoryMapper.toDomain(doc as CategorySchemaClass) : null;
  }

  async findByIds(id: Category['id'][]): Promise<Category[]> {
    const doc = await this.categoryModel.find({ _id: { $in: id } }).exec();
    return doc.map((doc) =>
      CategoryMapper.toDomain(doc as CategorySchemaClass),
    );
  }

  async findByName(name: Category['name']): Promise<NullableType<Category>> {
    const doc = await this.categoryModel.findOne({ name }).exec();
    return doc ? CategoryMapper.toDomain(doc as CategorySchemaClass) : null;
  }

  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<Category | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const doc = await this.categoryModel.findOne(filter);

    if (!doc) {
      return null;
    }

    const docUpdated = await this.categoryModel
      .findOneAndUpdate(filter, clonedPayload, { new: true })
      .exec();
    return docUpdated
      ? CategoryMapper.toDomain(docUpdated as CategorySchemaClass)
      : null;
  }

  async remove(id: Category['id']): Promise<void> {
    const filter = { _id: id.toString() };
    await this.categoryModel.deleteOne(filter).exec();
  }
}
