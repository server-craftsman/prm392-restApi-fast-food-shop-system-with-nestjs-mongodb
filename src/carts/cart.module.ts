import { Module } from '@nestjs/common';
import { CartsService } from './cart.service';
// import { CartsController } from './cart.controller';
import { CartsDocumentRepository } from './infrastructure/persistence/document/repositories/carts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CartsSchemaClass,
  CartSchema,
} from './infrastructure/persistence/document/entities/carts.schema';
import { CartRepository } from './infrastructure/persistence/cart.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartsSchemaClass.name, schema: CartSchema },
    ]),
  ],
  providers: [
    CartsService,
    CartsDocumentRepository,
    {
      provide: CartRepository,
      useClass: CartsDocumentRepository,
    },
  ],
  // controllers: [CartsController],
  exports: [CartsService, CartRepository],
})
export class CartModule {}
