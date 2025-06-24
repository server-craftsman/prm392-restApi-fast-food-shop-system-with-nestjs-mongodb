import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCustomOrderDto {
  @ApiProperty({ description: 'Cart ID' })
  @IsMongoId()
  cartId: string;

  @ApiProperty({
    description: 'Array of Product IDs to create order from cart',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  productIds: string[];

  @ApiProperty({
    description: 'Additional notes for the order',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
