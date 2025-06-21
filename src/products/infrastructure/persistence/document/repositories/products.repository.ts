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

@Injectable()
export class ProductsDocumentRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productsModel: Model<ProductSchemaClass>,
  ) {}

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
      query.price = filterOptions.price;
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
      query.rating = { $gte: filterOptions.rating, $lte: filterOptions.rating };
    }

    if (filterOptions?.stock) {
      query.stock = { $gte: filterOptions.stock, $lte: filterOptions.stock };
    }

    if (filterOptions?.createdAt) {
      query.createdAt = {
        $gte: filterOptions.createdAt,
        $lte: filterOptions.createdAt,
      };
    }

    if (filterOptions?.updatedAt) {
      query.updatedAt = {
        $gte: filterOptions.updatedAt,
        $lte: filterOptions.updatedAt,
      };
    }

    const sort: any = {};
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((opt) => {
        sort[opt.orderBy] = opt.order === 'desc' ? -1 : 1;
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
    const product = await this.productsModel.findById(id).exec();
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findByIds(ids: Product['id'][]): Promise<Product[]> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const products = await this.productsModel
      .find({ _id: { $in: objectIds } })
      .exec();
    return products.map(ProductMapper.toDomain);
  }

  async update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<Product | null> {
    const updated = await this.productsModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .exec();
    return updated ? ProductMapper.toDomain(updated) : null;
  }

  async remove(id: Product['id']): Promise<void> {
    await this.productsModel.findByIdAndDelete(id).exec();
  }
}
