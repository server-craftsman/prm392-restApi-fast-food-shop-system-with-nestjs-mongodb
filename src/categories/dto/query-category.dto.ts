import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class FilterCategoryDto {
  @ApiPropertyOptional({
    description: 'Name of category (case insensitive search)',
  })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional({ description: 'Filter by creation date (ISO string)' })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiPropertyOptional({ description: 'Filter by update date (ISO string)' })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}

export class SortCategoryDto {
  @ApiProperty({
    description: 'Field to sort by',
    enum: ['id', 'name', 'createdAt', 'updatedAt'],
  })
  @IsString()
  @IsEnum(['id', 'name', 'createdAt', 'updatedAt'])
  field: string;

  @ApiProperty({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}

export class QueryCategoryDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter for category',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      return plainToInstance(FilterCategoryDto, JSON.parse(value));
    } catch {
      return undefined;
    }
  })
  @ValidateNested()
  @Type(() => FilterCategoryDto)
  @ApiPropertyOptional({
    type: String,
    example: '{"name": "Electronics"}',
  })
  filters?: FilterCategoryDto | null;

  @ApiPropertyOptional({
    description: 'Sort for category',
    example: '[{"field": "name", "order": "ASC"}]',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.map((item) => plainToInstance(SortCategoryDto, item))
        : [plainToInstance(SortCategoryDto, parsed)];
    } catch {
      return undefined;
    }
  })
  @ValidateNested({ each: true })
  @Type(() => SortCategoryDto)
  sort?: SortCategoryDto[] | null;
}
