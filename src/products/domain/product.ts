import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class Product {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, required: false })
  description?: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: [FileType], required: false })
  images?: FileType[];

  @ApiProperty({ type: String, required: false })
  brand?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "50g", "1kg"' })
  weight?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "potato, salt, oil"' })
  ingredients?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Calories: 200, Fat: 10g, ..."' })
  nutritionFacts?: string;

  @ApiProperty({ type: Date, required: false, description: 'e.g. "2025-01-01"' })
  expiryDate?: Date;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Vietnam", "Thailand"' })
  origin?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Bag", "Box", "Can"' })
  packaging?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Keep in a cool, dry place"' })
  storageInstructions?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Ready to eat", "Microwave for 2 minutes"' })
  usageInstructions?: string;

  @ApiProperty({ type: Boolean, required: false, description: 'e.g. true if vegetarian' })
  isVegetarian?: boolean;

  @ApiProperty({ type: Boolean, required: false, description: 'e.g. true if vegan' })
  isVegan?: boolean;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Contains peanuts, milk"' })
  allergens?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "1 pack (50g)"' })
  servingSize?: string;

  @ApiProperty({ type: String, required: false, description: 'e.g. "Vietnam", "Thailand"' })
  countryOfManufacture?: string;

  @ApiProperty({ type: Number, required: false, description: 'Product rating from 0 to 5' })
  rating?: number;

  @ApiProperty({ type: Number, required: false, description: 'Available stock quantity' })
  stock?: number;

  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;

  @ApiProperty({ type: Date, required: false })
  deletedAt?: Date;
}