import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreDto {
    @ApiProperty({
        description: 'Store name',
        example: 'FastFood Downtown',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Store address',
        example: '123 Main Street, District 1, Ho Chi Minh City',
    })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({
        description: 'Store latitude coordinate',
        example: 10.7769,
        minimum: -90,
        maximum: 90,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number;

    @ApiProperty({
        description: 'Store longitude coordinate',
        example: 106.7009,
        minimum: -180,
        maximum: 180,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number;

    @ApiProperty({
        description: 'Store phone number',
        example: '+84901234567',
    })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
} 