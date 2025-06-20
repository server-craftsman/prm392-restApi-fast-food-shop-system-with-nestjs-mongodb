import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './domain/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async create(data: Partial<Cart>): Promise<Cart> {
    const created = new this.cartModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Cart>): Promise<Cart> {
    const updated = await this.cartModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Cart not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.cartModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Cart not found');
  }
}
