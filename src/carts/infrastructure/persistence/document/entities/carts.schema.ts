import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTION_PATH } from '../../../../../utils/collection.path';

@Schema({ timestamps: true })
export class CartsSchemaClass extends Document {
  @Prop({ type: String, required: true, unique: true })
  cartNo: string;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'cancelled';

  @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.USER, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Prop({ type: Date, required: false })
  updatedAt?: Date;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;
}

export const CartSchema = SchemaFactory.createForClass(CartsSchemaClass);
