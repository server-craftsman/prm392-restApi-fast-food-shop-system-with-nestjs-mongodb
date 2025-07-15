import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
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

    @ApiProperty({
        description: 'Message timestamp',
        example: '2024-01-01T12:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    timestamp?: Date;
} 