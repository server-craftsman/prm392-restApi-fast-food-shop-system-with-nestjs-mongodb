import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartDocumentRepository } from './repositories/cart-items.repository';
import { CartRepository } from '../cart.repository';
import { CartSchemaClass, CartSchema } from './entities/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartSchemaClass.name, schema: CartSchema },
    ]),
  ],
  providers: [
    {
      provide: CartRepository,
      useClass: CartDocumentRepository,
    },
  ],
  exports: [CartRepository, MongooseModule],
})
export class DocumentPersistenceModule {}
