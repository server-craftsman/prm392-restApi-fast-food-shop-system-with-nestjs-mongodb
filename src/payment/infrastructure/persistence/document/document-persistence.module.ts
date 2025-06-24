import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema, PaymentSchemaClass } from './entities/payments.schema';
import { PaymentRepository } from '../payment.repository';
import { PaymentsDocumentRepository } from './repositories/payments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSchemaClass.name, schema: PaymentSchema },
    ]),
  ],
  providers: [
    {
      provide: PaymentRepository,
      useClass: PaymentsDocumentRepository,
    },
  ],
  exports: [PaymentRepository],
})
export class DocumentPaymentPersistenceModule {}
