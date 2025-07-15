import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';
import { SendMessageDto, CreateMessageDto } from './dto';

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
    namespace: '/chat',
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly messageService: MessageService,
        private readonly conversationService: ConversationService,
    ) { }

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('ChatGateway initialized');
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    /**
     * Client joins a conversation room to receive/live chat
     * @param client Socket
     * @param payload { conversationId: string }
     */
    @SubscribeMessage('join')
    async handleJoinRoom(
        client: Socket,
        payload: { conversationId: string },
    ) {
        const { conversationId } = payload;
        if (!conversationId) return;

        // Verify conversation exists
        try {
            await this.conversationService.findOne(conversationId);
            client.join(conversationId);
            client.emit('joined', { conversationId });

            // Send recent messages to the newly joined client
            const recentMessages = await this.messageService.findByConversationId(conversationId, 20);
            client.emit('history', recentMessages.reverse()); // Send in chronological order
        } catch (error) {
            client.emit('error', { message: 'Conversation not found' });
        }
    }

    /**
     * Client sends message -> save to DB -> broadcast to room
     * payload: SendMessageDto
     */
    @SubscribeMessage('message')
    async handleMessage(
        client: Socket,
        payload: SendMessageDto,
    ) {
        const { conversationId, sender, content } = payload;
        if (!conversationId || !sender || !content) {
            client.emit('error', { message: 'Invalid message data' });
            return;
        }

        try {
            // Verify conversation exists
            await this.conversationService.findOne(conversationId as string);

            // Persist message in MongoDB
            const messageData: CreateMessageDto = {
                conversationId,
                sender,
                content,
                timestamp: new Date(),
            };
            const saved = await this.messageService.create(messageData);

            // Emit to all users in the conversation
            this.server.to(conversationId as string).emit('message', saved);
        } catch (error) {
            client.emit('error', { message: 'Failed to send message' });
        }
    }

    /**
     * Get conversation history
     * @param client Socket
     * @param payload { conversationId: string, limit?: number }
     */
    @SubscribeMessage('getHistory')
    async handleGetHistory(
        client: Socket,
        payload: { conversationId: string; limit?: number },
    ) {
        const { conversationId, limit = 50 } = payload;
        if (!conversationId) {
            client.emit('error', { message: 'Conversation ID required' });
            return;
        }

        try {
            const messages = await this.messageService.findByConversationId(conversationId, limit);
            client.emit('history', messages.reverse()); // Send in chronological order
        } catch (error) {
            client.emit('error', { message: 'Failed to get conversation history' });
        }
    }
} 