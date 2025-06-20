import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './domain/store.schema';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) {}

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async create(data: Partial<Store>): Promise<Store> {
    const created = new this.storeModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Store>): Promise<Store> {
    const updated = await this.storeModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Store not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.storeModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Store not found');
  }
}
