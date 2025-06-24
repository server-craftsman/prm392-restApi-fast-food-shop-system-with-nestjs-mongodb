import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Cart } from '../../../../domain/cart';
import { CartRepository } from '../../cart.repository';
import { CartSchemaClass } from '../entities/cart.schema';
import { CartMapper } from '../mappers/cart.mapper';
import { FilterCartDto, SortCartDto } from '../../../../dto/query-cart.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CartDocumentRepository extends CartRepository {
  constructor(
    @InjectModel(CartSchemaClass.name)
    private readonly cartModel: Model<CartSchemaClass>,
  ) {
    super();
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    return cart ? CartMapper.toDomain(cart) : null;
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.cartModel.findById(id).exec();
    return cart ? CartMapper.toDomain(cart) : null;
  }

  async findAll(): Promise<Cart[]> {
    const carts = await this.cartModel.find().exec();
    return carts.map((cart) => CartMapper.toDomain(cart));
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCartDto | null;
    sortOptions?: SortCartDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Cart[]> {
    const where: FilterQuery<CartSchemaClass> = {};

    if (filterOptions?.userId) {
      where['userId'] = new Types.ObjectId(filterOptions.userId);
    }

    if (filterOptions?.productId) {
      where['items.productId'] = new Types.ObjectId(filterOptions.productId);
    }

    // For filtering by cart total or items count, we'll use aggregation
    const pipeline: any[] = [
      { $match: where },
      {
        $addFields: {
          itemsCount: { $size: '$items' },
          // Note: total calculation would need product prices
          // For now, we'll just filter by items count
        },
      },
    ];

    if (filterOptions?.minItemsCount !== undefined) {
      pipeline.push({
        $match: { itemsCount: { $gte: filterOptions.minItemsCount } },
      });
    }

    if (filterOptions?.maxItemsCount !== undefined) {
      pipeline.push({
        $match: { itemsCount: { $lte: filterOptions.maxItemsCount } },
      });
    }

    // Add sorting
    if (sortOptions?.length) {
      const sortStage = sortOptions.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.field === 'id' ? '_id' : sort.field]:
            sort.order.toUpperCase() === 'ASC' ? 1 : -1,
        }),
        {},
      );
      pipeline.push({ $sort: sortStage });
    }

    // Add pagination
    pipeline.push(
      { $skip: (paginationOptions.page - 1) * paginationOptions.limit },
      { $limit: paginationOptions.limit },
    );

    const carts = await this.cartModel.aggregate(pipeline).exec();
    return carts.map((cart) => CartMapper.toDomain(cart));
  }

  async create(userId: string): Promise<Cart> {
    const cart = await this.cartModel.create({
      userId: new Types.ObjectId(userId),
    });
    return CartMapper.toDomain(cart);
  }

  async addProduct(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.cartModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          $push: {
            items: { productId: new Types.ObjectId(productId), quantity },
          },
        },
        { new: true, upsert: true },
      )
      .exec();
    return CartMapper.toDomain(cart);
  }

  async updateProductQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.cartModel
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          'items.productId': new Types.ObjectId(productId),
        },
        { $set: { 'items.$.quantity': quantity } },
        { new: true },
      )
      .exec();
    if (!cart) throw new NotFoundException('Item not found in cart.');
    return CartMapper.toDomain(cart);
  }

  async removeProduct(userId: string, productId: string): Promise<Cart | null> {
    const cart = await this.cartModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $pull: { items: { productId: new Types.ObjectId(productId) } } },
        { new: true },
      )
      .exec();
    return cart ? CartMapper.toDomain(cart) : null;
  }

  async clear(userId: string): Promise<void> {
    await this.cartModel
      .updateOne(
        { userId: new Types.ObjectId(userId) },
        { $set: { items: [] } },
      )
      .exec();
  }
}
