import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from './domain/conversation.schema';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  findAll(): Promise<Conversation[]> {
    return this.conversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Conversation> {
    return this.conversationService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Conversation>): Promise<Conversation> {
    return this.conversationService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Conversation>,
  ): Promise<Conversation> {
    return this.conversationService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.conversationService.delete(id);
  }
}
