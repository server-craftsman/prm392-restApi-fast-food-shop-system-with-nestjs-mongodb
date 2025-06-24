import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '../../../../payment-enum';
import { COLLECTION_PATH } from '../../../../../utils/collection.path';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type PaymentSchemaDocument = HydratedDocument<PaymentSchemaClass>;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
})
export class PaymentSchemaClass extends EntityDocumentHelper {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.ORDER, required: true })
    orderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_PATH.USER, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, min: 0 })
    amount: number;

    @Prop({ required: true, enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @Prop({ required: true, unique: true })
    transactionId: string;

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Prop({ required: false })
    paymentUrl?: string;

    @Prop({ required: false })
    zaloPayOrderId?: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop()
    deletedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentSchemaClass);

// Index for better query performance
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionId: 1 }); 