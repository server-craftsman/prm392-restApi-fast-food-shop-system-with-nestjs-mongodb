import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterOrderDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  cartId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt?: Date;
}

export class SortOrderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  field?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';
}

export class QueryOrderDto {
  @ApiPropertyOptional({ type: FilterOrderDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: FilterOrderDto;

  @ApiPropertyOptional({ type: SortOrderDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortOrderDto)
  sorts?: SortOrderDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
