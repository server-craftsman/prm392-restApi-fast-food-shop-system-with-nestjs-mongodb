import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Product } from '../domain/product';
import { RoleDto } from '../../roles/dto/role.dto';

export class FilterProductDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    name?: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    price?: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    description?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    categoryId?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: [Object] })
    images?: any[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    brand?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    weight?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    ingredients?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    nutritionFacts?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    expiryDate?: Date;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    origin?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    packaging?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    storageInstructions?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    usageInstructions?: string;

    @IsOptional()
    @ApiPropertyOptional()
    isVegetarian?: boolean;

    @IsOptional()
    @ApiPropertyOptional()
    isVegan?: boolean;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    allergens?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    servingSize?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    countryOfManufacture?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    createdAt?: Date;

    @IsOptional()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    updatedAt?: Date;

    @IsOptional()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    deletedAt?: Date;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    rating?: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    stock?: number;
}

export class SortProductDto {
    @ApiProperty()
    @Type(() => String)
    @IsString()
    orderBy: keyof Product;

    @ApiProperty()
    @IsString()
    order: string;
}

export class QueryProductDto {
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
        value ? plainToInstance(FilterProductDto, JSON.parse(value)) : undefined,
    )
    @ValidateNested()
    @Type(() => FilterProductDto)
    filters?: FilterProductDto | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @Transform(({ value }) => {
        return value ? plainToInstance(SortProductDto, JSON.parse(value)) : undefined;
    })
    @ValidateNested({ each: true })
    @Type(() => SortProductDto)
    sort?: SortProductDto[] | null;
}
