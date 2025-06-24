import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/orders.module';
import { DocumentPaymentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentPaymentPersistenceModule
  : DocumentPaymentPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    forwardRef(() => OrderModule),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService, infrastructurePersistenceModule],
})
export class PaymentModule { }
