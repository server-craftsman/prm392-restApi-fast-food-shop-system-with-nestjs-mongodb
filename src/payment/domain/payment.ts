import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '../payment-enum';
import { COLLECTION_PATH } from '../../utils/collection.path';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
// import { EntityDocumentHelper } from '../../utils/document-entity-helper';

@Schema({ timestamps: true })
export class PaymentSchemaClass extends Document {
  @ApiProperty({ description: 'Payment ID' })
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Order ID that this payment belongs to' })
  @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.ORDER, required: true })
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true })
  orderId: Types.ObjectId;

  @ApiProperty({ description: 'User ID who made the payment' })
  @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.USER, required: true })
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Payment amount' })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method used' })
  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Unique transaction ID' })
  @Prop({ required: true, unique: true })
  transactionId: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({
    description: 'ZaloPay payment URL (for ZaloPay method)',
    required: false,
  })
  @Prop({ required: false })
  paymentUrl?: string;

  @ApiProperty({
    description: 'ZaloPay order ID (for ZaloPay method)',
    required: false,
  })
  @Prop({ required: false })
  zaloPayOrderId?: string;

  @ApiProperty({ description: 'Payment description or notes', required: false })
  @Prop({ required: false })
  description?: string;

  @ApiProperty({ description: 'Payment creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Payment update timestamp' })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentSchemaClass);
