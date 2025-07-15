import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class SendMessageDto {
    @ApiProperty({
        description: 'Conversation ID',
        example: '507f1f77bcf86cd799439011',
    })
    @IsNotEmpty()
    @IsMongoId()
    conversationId: string | Types.ObjectId;

    @ApiProperty({
        description: 'Message sender identifier',
        example: 'user123',
    })
    @IsNotEmpty()
    @IsString()
    sender: string;

    @ApiProperty({
        description: 'Message content',
        example: 'Hello, how can I help you?',
    })
    @IsNotEmpty()
    @IsString()
    content: string;
} 