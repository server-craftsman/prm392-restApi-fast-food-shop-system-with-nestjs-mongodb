import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartRepository } from '../../cart.repository';
import { Cart } from '../../../../domain/cart';
import { CartsSchemaClass } from '../entities/carts.schema';
import { CartMapper } from '../mappers/carts.mapper';

@Injectable()
export class CartsDocumentRepository extends CartRepository {
  constructor(
    @InjectModel(CartsSchemaClass.name)
    private readonly cartModel: Model<CartsSchemaClass>,
  ) {
    super();
  }

  async create(data: Partial<Cart>): Promise<Cart> {
    const created = new this.cartModel(data);
    const saved = await created.save();
    return CartMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Cart | null> {
    const found = await this.cartModel.findById(id).exec();
    return found ? CartMapper.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const found = await this.cartModel.findOne({ userId }).exec();
    return found ? CartMapper.toDomain(found) : null;
  }

  async update(id: string, data: Partial<Cart>): Promise<Cart | null> {
    const updated = await this.cartModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return updated ? CartMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(id).exec();
  }
}
