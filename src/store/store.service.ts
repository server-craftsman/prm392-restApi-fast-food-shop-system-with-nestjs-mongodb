import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './domain/store.schema';
import {
  CreateStoreDto,
  UpdateStoreDto,
  QueryStoreDto,
} from './dto';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) { }

  async findAll(query: QueryStoreDto = {}): Promise<Store[]> {
    const filter: any = {};

    // Text search filters
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.address) {
      filter.address = { $regex: query.address, $options: 'i' };
    }
    if (query.phoneNumber) {
      filter.phoneNumber = { $regex: query.phoneNumber, $options: 'i' };
    }

    // Date range filters
    if (query.createdAfter || query.createdBefore) {
      filter.createdAt = {};
      if (query.createdAfter) {
        filter.createdAt.$gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        filter.createdAt.$lte = new Date(query.createdBefore);
      }
    }

    // Build aggregation pipeline
    const pipeline: any[] = [{ $match: filter }];

    // Location-based search using $geoNear
    if (query.nearLatitude && query.nearLongitude) {
      pipeline.unshift({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [query.nearLongitude, query.nearLatitude],
          },
          distanceField: 'distance',
          maxDistance: (query.radius || 10) * 1000, // Convert km to meters
          spherical: true,
        },
      });
    }

    // Add distance field for sorting
    if (query.sortBy === 'distance' && query.nearLatitude && query.nearLongitude) {
      // Distance already calculated in $geoNear
    } else {
      // Regular sorting
      const sort: any = {};
      if (query.sortBy && query.sortBy !== 'distance') {
        sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
      }
      if (Object.keys(sort).length > 0) {
        pipeline.push({ $sort: sort });
      }
    }

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return this.storeModel.aggregate(pipeline).exec();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async create(data: CreateStoreDto): Promise<Store> {
    try {
      // Create store with location automatically set by pre-save middleware
      const created = new this.storeModel(data);
      return await created.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Store with this data already exists');
      }
      throw new BadRequestException(`Error creating store: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateStoreDto): Promise<Store> {
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

  async findNearby(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20,
  ): Promise<Store[]> {
    return this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: radius * 1000, // Convert km to meters
          spherical: true,
        },
      },
      { $limit: limit },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
        },
      },
    ]).exec();
  }

  async getStoresByDistance(
    latitude: number,
    longitude: number,
    maxDistance: number = 50,
  ): Promise<Store[]> {
    return this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: maxDistance * 1000,
          spherical: true,
        },
      },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
        },
      },
    ]).exec();
  }
}
