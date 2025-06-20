import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './domain/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async create(data: Partial<Conversation>): Promise<Conversation> {
    const created = new this.conversationModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Conversation>): Promise<Conversation> {
    const updated = await this.conversationModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Conversation not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.conversationModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Conversation not found');
  }
}
