import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImageDto {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Bánh tráng trộn mắm tôm' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Bánh tráng ngon tuyệt' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  discount: number;

  @ApiProperty({ example: '65f1e1c2b1a2c3d4e5f6a7b8' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({
    type: [ImageDto],
    example: [
      { id: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' },
      { id: 'd409e0a26b6a824a46d6f7b8c9d0e1f2' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];

  @ApiPropertyOptional({ example: 'Oreo' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: '500g' })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiPropertyOptional({ example: 'Bột mì, đường, muối' })
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiPropertyOptional({ example: 'Năng lượng: 100kcal' })
  @IsString()
  @IsOptional()
  nutritionFacts?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiPropertyOptional({ example: 'Hộp giấy' })
  @IsString()
  @IsOptional()
  packaging?: string;

  @ApiPropertyOptional({ example: 'Bảo quản nơi khô ráo' })
  @IsString()
  @IsOptional()
  storageInstructions?: string;

  @ApiPropertyOptional({ example: 'Ăn trực tiếp' })
  @IsString()
  @IsOptional()
  usageInstructions?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiPropertyOptional({ example: 'Đậu phộng' })
  @IsString()
  @IsOptional()
  allergens?: string;

  @ApiPropertyOptional({ example: '1 cái' })
  @IsString()
  @IsOptional()
  servingSize?: string;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsString()
  @IsOptional()
  countryOfManufacture?: string;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @IsOptional()
  stock?: number;
}
