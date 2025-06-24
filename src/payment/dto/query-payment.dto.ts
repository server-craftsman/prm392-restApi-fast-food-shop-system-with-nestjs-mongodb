import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { PaymentStatus, PaymentMethod } from '../payment-enum';

export class FilterPaymentDto {
  @ApiPropertyOptional({ description: 'Filter by order ID' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    isArray: true,
    description: 'Filter by payment methods',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PaymentMethod, { each: true })
  paymentMethods?: PaymentMethod[];

  @ApiPropertyOptional({
    enum: PaymentStatus,
    isArray: true,
    description: 'Filter by payment status',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PaymentStatus, { each: true })
  statuses?: PaymentStatus[];

  @ApiPropertyOptional({ description: 'Filter by transaction ID' })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Filter by ZaloPay order ID' })
  @IsOptional()
  @IsString()
  zaloPayOrderId?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum amount' })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum amount' })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;
}

export class SortPaymentDto {
  @ApiProperty({
    description: 'Field to sort by',
    enum: [
      'id',
      'orderId',
      'userId',
      'amount',
      'paymentMethod',
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

export class QueryPaymentDto {
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
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter options as JSON string',
    example: '{"status":["paid"],"paymentMethods":["cash"],"minAmount":10000}',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterPaymentDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPaymentDto)
  filters?: FilterPaymentDto | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Sort options as JSON array string',
    example: '[{"field":"createdAt","order":"DESC"}]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortPaymentDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPaymentDto)
  sort?: SortPaymentDto[] | null;
}

export class QueryMyPaymentDto {
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
    example:
      '{"statuses":["paid"],"paymentMethods":["cash"],"minAmount":10000}',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterPaymentDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPaymentDto)
  filters?: Omit<FilterPaymentDto, 'userId'> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Sort options as JSON array string',
    example: '[{"field":"createdAt","order":"DESC"}]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortPaymentDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPaymentDto)
  sort?: SortPaymentDto[] | null;
}
