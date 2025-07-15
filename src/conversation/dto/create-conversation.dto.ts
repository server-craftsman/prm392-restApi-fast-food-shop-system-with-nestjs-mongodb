import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateConversationDto {
    @ApiProperty({
        description: 'Customer ID',
        example: '507f1f77bcf86cd799439011',
    })
    @IsNotEmpty()
    @IsMongoId()
    customerId: string | Types.ObjectId;

    @ApiProperty({
        description: 'Store ID',
        example: '507f1f77bcf86cd799439012',
    })
    @IsNotEmpty()
    @IsMongoId()
    storeId: string | Types.ObjectId;
} 