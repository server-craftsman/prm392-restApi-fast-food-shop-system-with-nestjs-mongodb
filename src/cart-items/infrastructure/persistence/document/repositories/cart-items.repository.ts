import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../../../../domain/cart';
import { CartRepository } from '../../cart.repository';
import { CartSchemaClass } from '../entities/cart.schema';
import { CartMapper } from '../mappers/cart.mapper';

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
