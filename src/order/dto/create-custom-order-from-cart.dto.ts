import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomOrderItemDto {
  @ApiProperty({ description: 'Product ID (optional for custom products)' })
  @IsMongoId()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Custom product name' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Product quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Custom notes for the product', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateCustomOrderFromCartDto {
  @ApiProperty({
    type: [CustomOrderItemDto],
    description: 'Additional custom order items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomOrderItemDto)
  items: CustomOrderItemDto[];

  @ApiProperty({
    description: 'Additional notes for the order',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
