import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { ProductsModule } from 'src/products/products.module';
import { DocumentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentPersistenceModule, CartItemsModule, ProductsModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
