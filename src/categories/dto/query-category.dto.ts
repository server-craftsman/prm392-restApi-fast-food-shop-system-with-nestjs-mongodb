import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class FilterCategoryDto {
  @ApiPropertyOptional({ description: 'Name of category' })
  @IsOptional()
  @IsString()
  name?: string | null;
}

export class SortCategoryDto {
  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsString()
  order?: string;
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
    example: '{   "name": "Coi Mọi GAY Da Đen"  }',
  })
  filters?: FilterCategoryDto | null;

  @ApiPropertyOptional({
    description: 'Sort for category',
    example: '[{ "field": "name", "order": "ASC" }]',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      return plainToInstance(SortCategoryDto, JSON.parse(value));
    } catch {
      return undefined;
    }
  })
  @ValidateNested({ each: true })
  @Type(() => SortCategoryDto)
  sort?: SortCategoryDto[] | null;
}
