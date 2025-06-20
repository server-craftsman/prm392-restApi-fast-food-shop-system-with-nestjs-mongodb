import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './domain/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async create(data: Partial<Message>): Promise<Message> {
    const created = new this.messageModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Message>): Promise<Message> {
    const updated = await this.messageModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.messageModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Message not found');
  }
}
