import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsController } from '../../../cart.controller';
import { CartsDocumentRepository } from './repositories/carts.repository';
import { CartRepository } from '../cart.repository';
import { CartsSchemaClass, CartSchema } from './entities/carts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartsSchemaClass.name, schema: CartSchema },
    ]),
  ],
  controllers: [CartsController],
  providers: [
    {
      provide: CartRepository,
      useClass: CartsDocumentRepository,
    },
  ],
  exports: [CartRepository],
})
export class DocumentPersistenceModule {}
