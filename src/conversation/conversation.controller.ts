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
import { ConversationService } from './conversation.service';
import { Conversation } from './domain/conversation.schema';
import {
  CreateConversationDto,
  UpdateConversationDto,
  QueryConversationDto,
} from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
  ApiNoContentResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Conversations')
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Get()
  @ApiOperation({ summary: 'Get all conversations with filtering and pagination' })
  @ApiOkResponse({ description: 'List of conversations', type: [Conversation] })
  findAll(@Query() query: QueryConversationDto): Promise<Conversation[]> {
    return this.conversationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiOkResponse({ description: 'Conversation details', type: Conversation })
  findOne(@Param('id') id: string): Promise<Conversation> {
    return this.conversationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create conversation' })
  @ApiBody({ description: 'Conversation payload', type: CreateConversationDto })
  @ApiCreatedResponse({ description: 'Conversation created', type: Conversation })
  create(@Body() data: CreateConversationDto): Promise<Conversation> {
    return this.conversationService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiBody({ description: 'Conversation updates', type: UpdateConversationDto })
  @ApiOkResponse({ description: 'Updated conversation', type: Conversation })
  update(
    @Param('id') id: string,
    @Body() data: UpdateConversationDto,
  ): Promise<Conversation> {
    return this.conversationService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiNoContentResponse({ description: 'Conversation deleted' })
  delete(@Param('id') id: string): Promise<void> {
    return this.conversationService.delete(id);
  }
}
