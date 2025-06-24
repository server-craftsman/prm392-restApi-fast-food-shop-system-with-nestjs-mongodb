import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Cart } from '../domain/cart';

export class FilterCartDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by product ID in cart items' })
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum total amount' })
  @IsOptional()
  @IsNumber()
  minTotal?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum total amount' })
  @IsOptional()
  @IsNumber()
  maxTotal?: number;

  @ApiPropertyOptional({ description: 'Filter by minimum items count' })
  @IsOptional()
  @IsNumber()
  minItemsCount?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum items count' })
  @IsOptional()
  @IsNumber()
  maxItemsCount?: number;
}

export class SortCartDto {
  @ApiProperty({
    description: 'Field to sort by',
    enum: ['id', 'userId', 'total', 'createdAt', 'updatedAt'],
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  order: 'ASC' | 'DESC';
}

export class QueryCartDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterCartDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterCartDto)
  filters?: FilterCartDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortCartDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortCartDto)
  sort?: SortCartDto[] | null;
}

export class QueryMyCartDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    maximum: 50,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class MyCartPaginationResponseDto {
  @ApiProperty({ type: Cart })
  cart: Cart;

  @ApiProperty({ description: 'Whether there are more items available' })
  @IsBoolean()
  hasNextPage: boolean;

  @ApiProperty({ description: 'Total number of items in cart' })
  @IsNumber()
  totalItems: number;
}
