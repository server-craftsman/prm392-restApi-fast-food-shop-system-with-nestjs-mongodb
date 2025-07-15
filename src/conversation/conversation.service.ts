import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './domain/conversation.schema';
import {
  CreateConversationDto,
  UpdateConversationDto,
  QueryConversationDto,
} from './dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async findAll(query: QueryConversationDto = {}): Promise<Conversation[]> {
    const filter: any = {};

    // Apply filters
    if (query.customerId) {
      filter.customerId = new Types.ObjectId(query.customerId);
    }
    if (query.storeId) {
      filter.storeId = new Types.ObjectId(query.storeId);
    }
    if (query.createdAfter || query.createdBefore) {
      filter.createdAt = {};
      if (query.createdAfter) {
        filter.createdAt.$gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        filter.createdAt.$lte = new Date(query.createdBefore);
      }
    }

    // Build sort object
    const sort: any = {};
    if (query.sortBy) {
      sort[query.sortBy] = query.sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    return this.conversationModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'name email')
      .populate('storeId', 'name address')
      .exec();
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('customerId', 'name email')
      .populate('storeId', 'name address')
      .exec();
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async create(data: CreateConversationDto): Promise<Conversation> {
    const conversationData = {
      ...data,
      customerId: new Types.ObjectId(data.customerId as string),
      storeId: new Types.ObjectId(data.storeId as string),
    };
    const created = new this.conversationModel(conversationData);
    return created.save();
  }

  async update(id: string, data: UpdateConversationDto): Promise<Conversation> {
    const updateData: any = { ...data };
    if (data.customerId) {
      updateData.customerId = new Types.ObjectId(data.customerId as string);
    }
    if (data.storeId) {
      updateData.storeId = new Types.ObjectId(data.storeId as string);
    }

    const updated = await this.conversationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('customerId', 'name email')
      .populate('storeId', 'name address')
      .exec();
    if (!updated) throw new NotFoundException('Conversation not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.conversationModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Conversation not found');
  }
}
