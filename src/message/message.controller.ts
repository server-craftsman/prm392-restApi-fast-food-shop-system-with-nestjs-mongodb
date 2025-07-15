import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './domain/message.schema';
import { CreateMessageDto, UpdateMessageDto, QueryMessageDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('Messages')
@Controller({
  path: 'messages',
  version: '1',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages with filtering and pagination' })
  @ApiOkResponse({ description: 'List of messages', type: [Message] })
  findAll(@Query() query: QueryMessageDto): Promise<Message[]> {
    return this.messageService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiOkResponse({ description: 'Message details', type: Message })
  findOne(@Param('id') id: string): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create message' })
  @ApiBody({ description: 'Message payload', type: CreateMessageDto })
  @ApiCreatedResponse({ description: 'Message created', type: Message })
  create(@Body() data: CreateMessageDto): Promise<Message> {
    return this.messageService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiBody({ description: 'Message updates', type: UpdateMessageDto })
  @ApiOkResponse({ description: 'Updated message', type: Message })
  update(
    @Param('id') id: string,
    @Body() data: UpdateMessageDto,
  ): Promise<Message> {
    return this.messageService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiNoContentResponse({ description: 'Message deleted' })
  delete(@Param('id') id: string): Promise<void> {
    return this.messageService.delete(id);
  }
}
