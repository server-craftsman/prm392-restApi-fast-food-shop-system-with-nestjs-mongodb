import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ type: [Object] }) // You may want to use a FileDto here
  @IsArray()
  @IsOptional()
  images?: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nutritionFacts?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packaging?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  storageInstructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  usageInstructions?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  allergens?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  servingSize?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  countryOfManufacture?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  stock?: number;
}
