import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './domain/message.schema';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
  ],
  providers: [MessageService, ChatGateway],
  controllers: [MessageController],
  exports: [MessageService, ChatGateway],
})
export class MessageModule {}
