import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';

import { ProductRepository } from '../../product.repository';
import { ProductSchemaClass } from '../entities/products.schema';
import { Product } from '../../../../domain/product';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import {
  FilterProductDto,
  SortProductDto,
} from '../../../../dto/query-product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { Category } from '../../../../../categories/domain/category';
import { CategorySchemaClass } from '../../../../../categories/infrastructure/persistence/document/entities/categories.schema';

@Injectable()
export class ProductsDocumentRepository extends ProductRepository {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productsModel: Model<ProductSchemaClass>,
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaClass>,
  ) {
    super();
  }

  async create(
    data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Product> {
    const persistenceModel = ProductMapper.toPersistence(data as Product);
    const createdProduct = new this.productsModel(persistenceModel);
    const productObject = await createdProduct.save();
    return ProductMapper.toDomain(productObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Product[]> {
    const { page, limit } = paginationOptions;
    const query: FilterQuery<ProductSchemaClass> = {};

    if (filterOptions?.categoryId) {
      query.categoryId = new Types.ObjectId(filterOptions.categoryId);
    }

    if (filterOptions?.name) {
      query.name = { $regex: filterOptions.name, $options: 'i' };
    }

    if (filterOptions?.price) {
      if (
        typeof filterOptions.price === 'object' &&
        (filterOptions.price.min !== undefined ||
          filterOptions.price.max !== undefined)
      ) {
        query.price = {};
        if (filterOptions.price.min !== undefined)
          query.price.$gte = filterOptions.price.min;
        if (filterOptions.price.max !== undefined)
          query.price.$lte = filterOptions.price.max;
      } else {
        query.price = filterOptions.price;
      }
    }

    if (filterOptions?.quantity) {
      if (
        typeof filterOptions.quantity === 'object' &&
        (filterOptions.quantity.min !== undefined ||
          filterOptions.quantity.max !== undefined)
      ) {
        query.quantity = {};
        if (filterOptions.quantity.min !== undefined)
          query.quantity.$gte = filterOptions.quantity.min;
        if (filterOptions.quantity.max !== undefined)
          query.quantity.$lte = filterOptions.quantity.max;
      } else {
        query.quantity = filterOptions.quantity;
      }
    }

    if (filterOptions?.discount) {
      if (
        typeof filterOptions.discount === 'object' &&
        (filterOptions.discount.min !== undefined ||
          filterOptions.discount.max !== undefined)
      ) {
        query.discount = {};
        if (filterOptions.discount.min !== undefined)
          query.discount.$gte = filterOptions.discount.min;
        if (filterOptions.discount.max !== undefined)
          query.discount.$lte = filterOptions.discount.max;
      } else {
        query.discount = filterOptions.discount;
      }
    }

    if (filterOptions?.brand) {
      query.brand = { $regex: filterOptions.brand, $options: 'i' };
    }

    if (filterOptions?.countryOfManufacture) {
      query.countryOfManufacture = {
        $regex: filterOptions.countryOfManufacture,
        $options: 'i',
      };
    }

    if (filterOptions?.description) {
      query.description = { $regex: filterOptions.description, $options: 'i' };
    }

    if (filterOptions?.rating) {
      if (
        typeof filterOptions.rating === 'object' &&
        (filterOptions.rating.min !== undefined ||
          filterOptions.rating.max !== undefined)
      ) {
        query.rating = {};
        if (filterOptions.rating.min !== undefined)
          query.rating.$gte = filterOptions.rating.min;
        if (filterOptions.rating.max !== undefined)
          query.rating.$lte = filterOptions.rating.max;
      } else {
        query.rating = filterOptions.rating;
      }
    }

    if (filterOptions?.stock) {
      if (
        typeof filterOptions.stock === 'object' &&
        (filterOptions.stock.min !== undefined ||
          filterOptions.stock.max !== undefined)
      ) {
        query.stock = {};
        if (filterOptions.stock.min !== undefined)
          query.stock.$gte = filterOptions.stock.min;
        if (filterOptions.stock.max !== undefined)
          query.stock.$lte = filterOptions.stock.max;
      } else {
        query.stock = filterOptions.stock;
      }
    }

    if (
      filterOptions?.createdAt &&
      typeof filterOptions.createdAt === 'object' &&
      !('getTime' in filterOptions.createdAt) &&
      ('from' in filterOptions.createdAt || 'to' in filterOptions.createdAt)
    ) {
      query.createdAt = {};
      if (filterOptions.createdAt.from)
        query.createdAt.$gte = filterOptions.createdAt.from;
      if (filterOptions.createdAt.to)
        query.createdAt.$lte = filterOptions.createdAt.to;
    } else if (filterOptions?.createdAt) {
      query.createdAt = filterOptions.createdAt;
    }

    if (
      filterOptions?.updatedAt &&
      typeof filterOptions.updatedAt === 'object' &&
      !('getTime' in filterOptions.updatedAt) &&
      ('from' in filterOptions.updatedAt || 'to' in filterOptions.updatedAt)
    ) {
      query.updatedAt = {};
      if (filterOptions.updatedAt.from)
        query.updatedAt.$gte = filterOptions.updatedAt.from;
      if (filterOptions.updatedAt.to)
        query.updatedAt.$lte = filterOptions.updatedAt.to;
    } else if (filterOptions?.updatedAt) {
      query.updatedAt = filterOptions.updatedAt;
    }

    const sort: any = {};
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((opt) => {
        sort[opt.field] = opt.order === 'desc' ? -1 : 1;
      });
    }

    const products = await this.productsModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .exec();

    return products.map(ProductMapper.toDomain);
  }

  async findById(id: Product['id']): Promise<NullableType<Product>> {
    if (!Types.ObjectId.isValid(id)) return null;
    const product = await this.productsModel.findById(id).exec();
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findByIds(ids: Product['id'][]): Promise<Product[]> {
    const objectIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (objectIds.length === 0) return [];
    const products = await this.productsModel
      .find({ _id: { $in: objectIds } })
      .exec();
    return products.map(ProductMapper.toDomain);
  }

  async findByCategoryId(categoryId: Category['id']): Promise<Product[]> {
    if (!Types.ObjectId.isValid(categoryId))
      throw new Error('Invalid categoryId');
    const products = await this.productsModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .exec();
    return products.map(ProductMapper.toDomain);
  }

  async findByCategoryIds(categoryIds: Category['id'][]): Promise<Product[]> {
    const objectIds = categoryIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (objectIds.length === 0) throw new Error('No valid categoryIds');
    const products = await this.productsModel
      .find({ categoryId: { $in: objectIds } })
      .exec();
    return products.map(ProductMapper.toDomain);
  }

  async countByCategoryId(categoryId: Category['id']): Promise<number> {
    if (!Types.ObjectId.isValid(categoryId))
      throw new Error('Invalid categoryId');
    return this.productsModel
      .countDocuments({ categoryId: new Types.ObjectId(categoryId) })
      .exec();
  }

  async update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<Product | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updated = await this.productsModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .exec();
    return updated ? ProductMapper.toDomain(updated) : null;
  }

  async remove(id: Product['id']): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await this.productsModel.findByIdAndDelete(id).exec();
  }

  async removeByCategoryId(categoryId: Category['id']): Promise<void> {
    if (!Types.ObjectId.isValid(categoryId))
      throw new Error('Invalid categoryId');
    await this.productsModel
      .deleteMany({ categoryId: new Types.ObjectId(categoryId) })
      .exec();
  }

  async updateCategoryForProducts(
    oldCategoryId: Category['id'],
    newCategoryId: Category['id'],
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(oldCategoryId) ||
      !Types.ObjectId.isValid(newCategoryId)
    )
      throw new Error('Invalid categoryId');
    await this.productsModel
      .updateMany(
        { categoryId: new Types.ObjectId(oldCategoryId) },
        { $set: { categoryId: new Types.ObjectId(newCategoryId) } },
      )
      .exec();
  }

  async findByCategoryName(categoryName: Category['name']): Promise<Product[]> {
    // Find the category by name (case-insensitive)
    const category = await this.categoryModel
      .findOne({ name: { $regex: `^${categoryName}$`, $options: 'i' } })
      .exec();
    if (!category) throw new Error('Category not found');
    const products = await this.productsModel
      .find({ categoryId: category._id })
      .exec();
    return products.map(ProductMapper.toDomain);
  }

  async findCategoriesWithProducts(): Promise<Category[]> {
    // Aggregate to find unique categoryIds in products
    const categoryIds = await this.productsModel.distinct('categoryId').exec();
    if (!categoryIds || categoryIds.length === 0)
      throw new Error('No categories with products found');
    // Find categories with those ids
    const categories = await this.categoryModel
      .find({ _id: { $in: categoryIds } })
      .exec();
    // Map to domain if needed, otherwise return as is
    return categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
    }));
  }
}
