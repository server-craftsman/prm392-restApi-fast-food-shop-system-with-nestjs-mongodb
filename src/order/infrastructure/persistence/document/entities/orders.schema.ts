import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { COLLECTION_PATH } from '../../../../../utils/collection.path';
import { OrderStatus } from '../../../../order-status.enum';

@Schema({ _id: false })
export class OrderItemsSchemaClass {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: COLLECTION_PATH.PRODUCT,
    required: false,
  })
  productId?: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  notes?: string;
}

const OrderItemsSchema = SchemaFactory.createForClass(OrderItemsSchemaClass);

@Schema({ timestamps: true, toJSON: { virtuals: true, getters: true } })
export class OrderSchemaClass extends Document {
  @Prop({ type: [OrderItemsSchema], required: true, default: [] })
  items: OrderItemsSchemaClass[];

  @Prop({ required: true })
  total: number;

  @Prop({ enum: OrderStatus, required: true })
  status: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: COLLECTION_PATH.CART,
    required: true,
  })
  cartId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: COLLECTION_PATH.USER,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: false })
  notes?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);
