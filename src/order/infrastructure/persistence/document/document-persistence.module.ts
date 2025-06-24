import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchemaClass, OrderSchema } from './entities/orders.schema';
import { OrderRepository } from '../order.repository';
import { OrdersDocumentRepository } from './repositories/orders.repository';
import {
  ProductSchemaClass,
  ProductSchema,
} from '../../../../products/infrastructure/persistence/document/entities/products.schema';
import {
  CartSchema,
  CartSchemaClass,
} from '../../../../cart-items/infrastructure/persistence/document/entities/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: CartSchemaClass.name, schema: CartSchema },
      { name: ProductSchemaClass.name, schema: ProductSchema },
    ]),
  ],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrdersDocumentRepository,
    },
    OrdersDocumentRepository,
  ],
  exports: [OrderRepository, OrdersDocumentRepository, MongooseModule],
})
export class DocumentPersistenceModule {}
