import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Payment } from '../../../../domain/payment';
import { PaymentRepository } from '../../payment.repository';
import { PaymentSchemaClass } from '../entities/payments.schema';
import { PaymentMapper } from '../mappers/payments.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class PaymentsDocumentRepository implements PaymentRepository {
    constructor(
        @InjectModel(PaymentSchemaClass.name)
        private readonly paymentsModel: Model<PaymentSchemaClass>,
    ) { }

    async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Payment> {
        const persistenceModel = PaymentMapper.toPersistence({
            ...data,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Payment);

        const createdPayment = new this.paymentsModel(persistenceModel);
        const paymentObject = await createdPayment.save();
        return PaymentMapper.toDomain(paymentObject);
    }

    async findAll(): Promise<Payment[]> {
        const paymentObjects = await this.paymentsModel.find().exec();
        return paymentObjects.map((paymentObject) => PaymentMapper.toDomain(paymentObject));
    }

    async findById(id: Payment['id']): Promise<NullableType<Payment>> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const paymentObject = await this.paymentsModel.findById(id).exec();
        return paymentObject ? PaymentMapper.toDomain(paymentObject) : null;
    }

    async findByOrderId(orderId: string): Promise<Payment[]> {
        if (!Types.ObjectId.isValid(orderId)) {
            return [];
        }

        const paymentObjects = await this.paymentsModel
            .find({ orderId: new Types.ObjectId(orderId) })
            .exec();
        return paymentObjects.map((paymentObject) => PaymentMapper.toDomain(paymentObject));
    }

    async findByUserId(userId: string): Promise<Payment[]> {
        if (!Types.ObjectId.isValid(userId)) {
            return [];
        }

        const paymentObjects = await this.paymentsModel
            .find({ userId: new Types.ObjectId(userId) })
            .exec();
        return paymentObjects.map((paymentObject) => PaymentMapper.toDomain(paymentObject));
    }

    async findByTransactionId(transactionId: string): Promise<NullableType<Payment>> {
        const paymentObject = await this.paymentsModel
            .findOne({ transactionId })
            .exec();
        return paymentObject ? PaymentMapper.toDomain(paymentObject) : null;
    }

    async findByZaloPayOrderId(zaloPayOrderId: string): Promise<NullableType<Payment>> {
        const paymentObject = await this.paymentsModel
            .findOne({ zaloPayOrderId })
            .exec();
        return paymentObject ? PaymentMapper.toDomain(paymentObject) : null;
    }

    async findManyWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }): Promise<Payment[]> {
        const paymentObjects = await this.paymentsModel
            .find()
            .skip((paginationOptions.page - 1) * paginationOptions.limit)
            .limit(paginationOptions.limit)
            .exec();

        return paymentObjects.map((paymentObject) => PaymentMapper.toDomain(paymentObject));
    }

    async update(id: Payment['id'], payload: DeepPartial<Payment>): Promise<Payment | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const clonedPayload = { ...payload };
        delete clonedPayload.id;

        const filter = { _id: id.toString() };
        const payment = await this.paymentsModel.findOne(filter).exec();

        if (!payment) {
            return null;
        }

        const paymentObject = await this.paymentsModel.findOneAndUpdate(
            filter,
            PaymentMapper.toPersistence({
                ...PaymentMapper.toDomain(payment),
                ...clonedPayload,
                updatedAt: new Date(),
            } as Payment),
            { new: true },
        ).exec();

        return paymentObject ? PaymentMapper.toDomain(paymentObject) : null;
    }

    async remove(id: Payment['id']): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            return;
        }

        await this.paymentsModel.deleteOne({
            _id: id.toString(),
        }).exec();
    }
} 