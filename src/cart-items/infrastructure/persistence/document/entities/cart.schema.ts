import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ProductSchemaClass } from '../../../../../products/infrastructure/persistence/document/entities/products.schema';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

// This is a sub-document, it doesn't need its own collection
@Schema({ _id: false })
export class CartItemSchema {
  @ApiProperty({ type: () => ProductSchemaClass })
  @Prop({ type: SchemaTypes.ObjectId, ref: ProductSchemaClass.name })
  productId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  quantity: number;
}
export const ItemSchema = SchemaFactory.createForClass(CartItemSchema);

@Schema({ timestamps: true })
export class CartSchemaClass extends Document {
  @ApiProperty({ type: () => UserSchemaClass })
  @Prop({ type: SchemaTypes.ObjectId, ref: UserSchemaClass.name })
  userId: Types.ObjectId;

  @ApiProperty({ example: true })
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty({ type: [CartItemSchema] })
  @Prop({ type: [ItemSchema], default: [] })
  items: CartItemSchema[];
}

export const CartSchema = SchemaFactory.createForClass(CartSchemaClass);
