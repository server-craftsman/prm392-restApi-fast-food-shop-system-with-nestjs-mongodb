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
  @Transform(({ value }) =>
    value ? plainToInstance(FilterCategoryDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterCategoryDto)
  filters?: FilterCategoryDto | null;

  @ApiPropertyOptional({
    description: 'Sort for category',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(SortCategoryDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortCategoryDto)
  sort?: SortCategoryDto[] | null;
}
