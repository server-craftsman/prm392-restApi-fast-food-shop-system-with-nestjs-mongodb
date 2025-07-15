import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './domain/message.schema';
import { CreateMessageDto, UpdateMessageDto, QueryMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findAll(query: QueryMessageDto = {}): Promise<Message[]> {
    const filter: any = {};

    // Apply filters
    if (query.conversationId) {
      filter.conversationId = new Types.ObjectId(query.conversationId);
    }
    if (query.sender) {
      filter.sender = query.sender;
    }
    if (query.search) {
      filter.content = { $regex: query.search, $options: 'i' };
    }
    if (query.after || query.before) {
      filter.timestamp = {};
      if (query.after) {
        filter.timestamp.$gte = new Date(query.after);
      }
      if (query.before) {
        filter.timestamp.$lte = new Date(query.before);
      }
    }

    // Build sort object
    const sort: any = {};
    if (query.sortBy) {
      sort[query.sortBy] = query.sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    return this.messageModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('conversationId', 'customerId storeId')
      .exec();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel
      .findById(id)
      .populate('conversationId', 'customerId storeId')
      .exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async create(data: CreateMessageDto): Promise<Message> {
    const messageData = {
      ...data,
      conversationId: new Types.ObjectId(data.conversationId as string),
      timestamp: data.timestamp || new Date(),
    };
    const created = new this.messageModel(messageData);
    return created.save();
  }

  async update(id: string, data: UpdateMessageDto): Promise<Message> {
    const updateData: any = { ...data };
    if (data.conversationId) {
      updateData.conversationId = new Types.ObjectId(
        data.conversationId as string,
      );
    }

    const updated = await this.messageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('conversationId', 'customerId storeId')
      .exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.messageModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Message not found');
  }

  // Additional methods for chat functionality
  async findByConversationId(
    conversationId: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('conversationId', 'customerId storeId')
      .exec();
  }
}
