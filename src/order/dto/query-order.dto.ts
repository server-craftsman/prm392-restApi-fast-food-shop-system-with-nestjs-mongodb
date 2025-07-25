import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { OrderStatus } from '../order-status.enum';

export class FilterOrderDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by cart ID' })
  @IsOptional()
  @IsMongoId()
  cartId?: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    description: 'Filter by order statuses',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(OrderStatus, { each: true })
  statuses?: OrderStatus[];

  @ApiPropertyOptional({ description: 'Filter by minimum total amount' })
  @IsOptional()
  @IsNumber()
  minTotal?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum total amount' })
  @IsOptional()
  @IsNumber()
  maxTotal?: number;

  @ApiPropertyOptional({ description: 'Search in order notes' })
  @IsOptional()
  @IsString()
  notesSearch?: string;
}

export class SortOrderDto {
  @ApiProperty({
    description: 'Field to sort by',
    enum: [
      'id',
      'userId',
      'cartId',
      'total',
      'status',
      'createdAt',
      'updatedAt',
    ],
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

export class QueryOrderDto {
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
    value ? plainToInstance(FilterOrderDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: FilterOrderDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortOrderDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortOrderDto)
  sort?: SortOrderDto[] | null;
}

export class QueryMyOrderDto {
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

  @ApiPropertyOptional({
    type: String,
    description:
      'Filter options as JSON string (userId will be automatically set)',
    example: '{"statuses":["pending","confirmed"],"minTotal":50000}',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterOrderDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: Omit<FilterOrderDto, 'userId'> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Sort options as JSON array string',
    example: '[{"field":"createdAt","order":"DESC"}]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortOrderDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortOrderDto)
  sort?: SortOrderDto[] | null;
}
