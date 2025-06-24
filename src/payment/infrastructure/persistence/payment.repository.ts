import { PaymentSchemaClass } from 'src/payment/domain/payment';

export abstract class PaymentRepository {
  abstract findAll(): Promise<PaymentSchemaClass[]>;
  abstract findOne(id: string): Promise<PaymentSchemaClass>;
  abstract findByOrderId(orderId: string): Promise<PaymentSchemaClass[]>;
  abstract findByUserId(userId: string): Promise<PaymentSchemaClass[]>;
  abstract create(payment: PaymentSchemaClass): Promise<PaymentSchemaClass>;
  abstract update(
    id: string,
    payment: PaymentSchemaClass,
  ): Promise<PaymentSchemaClass>;
  abstract delete(id: string): Promise<void>;
}
