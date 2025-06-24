import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Product } from '../domain/product';

export class RangeNumberDto {
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  max?: number;
}

export class RangeDateDto {
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  from?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  to?: Date;
}

export class FilterProductDto {
  @ApiPropertyOptional({ example: 'Bánh tráng' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'number' },
      { $ref: '#/components/schemas/RangeNumberDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  price?: number | RangeNumberDto;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'number' },
      { $ref: '#/components/schemas/RangeNumberDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  quantity?: number | RangeNumberDto;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'number' },
      { $ref: '#/components/schemas/RangeNumberDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  discount?: number | RangeNumberDto;

  @ApiPropertyOptional({ example: 'Ngon tuyệt' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '65f1e1c2b1a2c3d4e5f6a7b8' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String], example: ['img1.jpg', 'img2.jpg'] })
  @IsOptional()
  @IsArray()
  images?: any[];

  @ApiPropertyOptional({ example: 'Oreo' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: '500g' })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiPropertyOptional({ example: 'Bột mì, đường, muối' })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({ example: 'Năng lượng: 100kcal' })
  @IsOptional()
  @IsString()
  nutritionFacts?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  expiryDate?: Date;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({ example: 'Hộp giấy' })
  @IsOptional()
  @IsString()
  packaging?: string;

  @ApiPropertyOptional({ example: 'Bảo quản nơi khô ráo' })
  @IsOptional()
  @IsString()
  storageInstructions?: string;

  @ApiPropertyOptional({ example: 'Ăn trực tiếp' })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @ApiPropertyOptional({ example: 'Đậu phộng' })
  @IsOptional()
  @IsString()
  allergens?: string;

  @ApiPropertyOptional({ example: '1 cái' })
  @IsOptional()
  @IsString()
  servingSize?: string;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  countryOfManufacture?: string;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'string', format: 'date-time' },
      { $ref: '#/components/schemas/RangeDateDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  createdAt?: Date | RangeDateDto;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'string', format: 'date-time' },
      { $ref: '#/components/schemas/RangeDateDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  updatedAt?: Date | RangeDateDto;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'number' },
      { $ref: '#/components/schemas/RangeNumberDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  rating?: number | RangeNumberDto;

  @ApiPropertyOptional({
    oneOf: [
      { type: 'number' },
      { $ref: '#/components/schemas/RangeNumberDto' },
    ],
  })
  @IsOptional()
  @Type(() => Object)
  stock?: number | RangeNumberDto;
}

export class SortProductDto {
  @ApiProperty({ example: 'name' })
  @Type(() => String)
  @IsString()
  field: keyof Product;

  @ApiProperty({ example: 'ASC' })
  @IsString()
  order: string;
}

export class QueryProductDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter for product',
    type: String,
    example: '{ "name": "Bánh tráng", "price": { "min": 10, "max": 100 } }',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterProductDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterProductDto)
  filters?: FilterProductDto | null;

  @ApiPropertyOptional({
    description: 'Sort for product',
    type: String,
    example: '[{ "field": "name", "order": "ASC" }]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortProductDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortProductDto)
  sort?: SortProductDto[] | null;
}
