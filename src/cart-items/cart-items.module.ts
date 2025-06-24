import { Module } from '@nestjs/common';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { CartRepository } from './infrastructure/persistence/cart.repository';
import { CartDocumentRepository } from './infrastructure/persistence/document/repositories/cart-items.repository';
import { DocumentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [DocumentPersistenceModule],
  controllers: [CartItemsController],
  providers: [
    CartItemsService,
    {
      provide: CartRepository,
      useClass: CartDocumentRepository,
    },
    Reflector,
  ],
  exports: [CartItemsService, CartRepository, DocumentPersistenceModule],
})
export class CartItemsModule {}
