import { Payment } from '../../domain/payment';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { DeepPartial } from '../../../utils/types/deep-partial.type';

export abstract class PaymentRepository {
    abstract create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Payment>;

    abstract findAll(): Promise<Payment[]>;

    abstract findById(id: Payment['id']): Promise<NullableType<Payment>>;

    abstract findByOrderId(orderId: string): Promise<Payment[]>;

    abstract findByUserId(userId: string): Promise<Payment[]>;

    abstract findByTransactionId(transactionId: string): Promise<NullableType<Payment>>;

    abstract findByZaloPayOrderId(zaloPayOrderId: string): Promise<NullableType<Payment>>;

    abstract findManyWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }): Promise<Payment[]>;

    abstract update(
        id: Payment['id'],
        payload: DeepPartial<Payment>,
    ): Promise<Payment | null>;

    abstract remove(id: Payment['id']): Promise<void>;
}
