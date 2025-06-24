import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchemaClass, PaymentSchema } from './domain/payment';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSchemaClass.name, schema: PaymentSchema },
    ]),
    forwardRef(() => OrderModule),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
