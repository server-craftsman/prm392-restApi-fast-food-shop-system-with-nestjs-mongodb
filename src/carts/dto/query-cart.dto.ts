import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterCartDto {
  @ApiPropertyOptional({
    description: 'Filter by cart number',
    example: 'CART123',
  })
  @IsOptional()
  @IsString()
  cartNo?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'pending',
    enum: ['pending', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  status?: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Filter by userId',
    example: 'userId123',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class SortCartDto {
  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'cartNo',
    enum: ['cartNo', 'status', 'userId', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  field?: 'cartNo' | 'status' | 'userId' | 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}

export class QueryCartDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Page limit', example: 10 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter', type: FilterCartDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterCartDto)
  filter?: FilterCartDto;

  @ApiPropertyOptional({ description: 'Sort', type: SortCartDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortCartDto)
  sort?: SortCartDto;
}
