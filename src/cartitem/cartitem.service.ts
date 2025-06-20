import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem } from './domain/cartitem.schema';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
  ) {}

  async findAll(): Promise<CartItem[]> {
    return this.cartItemModel.find().exec();
  }

  async findOne(id: string): Promise<CartItem> {
    const cartItem = await this.cartItemModel.findById(id).exec();
    if (!cartItem) throw new NotFoundException('CartItem not found');
    return cartItem;
  }

  async create(data: Partial<CartItem>): Promise<CartItem> {
    const created = new this.cartItemModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<CartItem>): Promise<CartItem> {
    const updated = await this.cartItemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('CartItem not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.cartItemModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('CartItem not found');
  }
}
