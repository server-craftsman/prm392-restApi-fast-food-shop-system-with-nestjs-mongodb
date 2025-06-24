import { Payment } from '../../../../domain/payment';
import { PaymentSchemaClass } from '../entities/payments.schema';
import { Types } from 'mongoose';

export class PaymentMapper {
    static toDomain(raw: PaymentSchemaClass): Payment {
        const domainEntity = new Payment();
        domainEntity.id = raw._id.toString();
        domainEntity.orderId = raw.orderId.toString();
        domainEntity.userId = raw.userId.toString();
        domainEntity.amount = raw.amount;
        domainEntity.paymentMethod = raw.paymentMethod;
        domainEntity.transactionId = raw.transactionId;
        domainEntity.status = raw.status;
        domainEntity.paymentUrl = raw.paymentUrl;
        domainEntity.zaloPayOrderId = raw.zaloPayOrderId;
        domainEntity.description = raw.description;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        if (raw.deletedAt) {
            domainEntity.deletedAt = raw.deletedAt;
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: Payment): PaymentSchemaClass {
        const persistenceSchema = new PaymentSchemaClass();

        if (domainEntity.id && typeof domainEntity.id === 'string') {
            persistenceSchema._id = domainEntity.id;
        }

        persistenceSchema.orderId = new Types.ObjectId(domainEntity.orderId);
        persistenceSchema.userId = new Types.ObjectId(domainEntity.userId);
        persistenceSchema.amount = domainEntity.amount;
        persistenceSchema.paymentMethod = domainEntity.paymentMethod;
        persistenceSchema.transactionId = domainEntity.transactionId;
        persistenceSchema.status = domainEntity.status;
        persistenceSchema.paymentUrl = domainEntity.paymentUrl;
        persistenceSchema.zaloPayOrderId = domainEntity.zaloPayOrderId;
        persistenceSchema.description = domainEntity.description;
        persistenceSchema.createdAt = domainEntity.createdAt;
        persistenceSchema.updatedAt = domainEntity.updatedAt;
        if (domainEntity.deletedAt) {
            persistenceSchema.deletedAt = domainEntity.deletedAt;
        }

        return persistenceSchema;
    }
} 