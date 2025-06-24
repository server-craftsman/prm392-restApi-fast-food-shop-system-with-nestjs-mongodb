import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';

import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type ProductSchemaDocument = HydratedDocument<ProductSchemaClass>;
import { COLLECTION_PATH } from '../../../../../utils/collection.path';
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ProductSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  discount: number;

  @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.CATEGORY, required: true })
  categoryId: Types.ObjectId;

  @Prop({
    type: [FileSchemaClass],
    default: [],
  })
  images: FileSchemaClass[];

  @Prop()
  brand: string;

  @Prop()
  weight: string; // e.g. "50g", "1kg"

  @Prop()
  ingredients: string; // e.g. [nguyên liệu]: "potato, salt, oil"

  @Prop()
  nutritionFacts: string; // e.g. [thành phần dinh dưỡng]: "Calories: 200, Fat: 10g, ..."

  @Prop()
  expiryDate: Date; // e.g. [hạn sử dụng]: "2025-01-01"

  @Prop()
  origin: string; // e.g. [nơi sản xuất]: "Vietnam", "Thailand"

  @Prop()
  packaging: string; // e.g. [hình thức đóng gói]: "Bag", "Box", "Can"

  @Prop()
  storageInstructions: string; // e.g. [hướng dẫn bảo quản]: "Keep in a cool, dry place"

  @Prop()
  usageInstructions: string; // e.g. [hướng dẫn sử dụng]: "Ready to eat", "Microwave for 2 minutes"

  @Prop()
  isVegetarian: boolean; // e.g. [loại hình sản phẩm]: "vegetarian"

  @Prop()
  isVegan: boolean; // e.g. [loại hình sản phẩm]: "vegan"

  @Prop()
  allergens: string; // e.g. [chất gây dị ứng]: "Contains peanuts, milk"

  @Prop()
  servingSize: string; // e.g. [khối lượng]: "1 pack (50g)"

  @Prop()
  countryOfManufacture: string; // e.g. [nơi sản xuất]: "Vietnam", "Thailand"

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);
