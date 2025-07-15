import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMessageDto {
    @ApiPropertyOptional({
        description: 'Conversation ID for filtering',
        example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsMongoId()
    conversationId?: string;

    @ApiPropertyOptional({
        description: 'Sender for filtering',
        example: 'user123',
    })
    @IsOptional()
    @IsString()
    sender?: string;

    @ApiPropertyOptional({
        description: 'Search in message content',
        example: 'hello',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Messages after timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    after?: string;

    @ApiPropertyOptional({
        description: 'Messages before timestamp',
        example: '2024-12-31T23:59:59.999Z',
    })
    @IsOptional()
    @IsDateString()
    before?: string;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'timestamp',
        enum: ['timestamp', 'createdAt'],
    })
    @IsOptional()
    sortBy?: string = 'timestamp';

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    sortOrder?: 'asc' | 'desc' = 'desc';
} 