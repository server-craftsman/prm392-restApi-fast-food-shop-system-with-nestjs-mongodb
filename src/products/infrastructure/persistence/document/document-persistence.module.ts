import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../../../../categories/infrastructure/persistence/document/entities/categories.schema';
import { ProductSchema } from './entities/products.schema';
import { ProductRepository } from '../product.repository';
import { ProductsDocumentRepository } from './repositories/products.repository';
import { COLLECTION_PATH } from '../../../../utils/collection.path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COLLECTION_PATH.PRODUCT, schema: ProductSchema },
      { name: COLLECTION_PATH.CATEGORY, schema: CategorySchema },
    ]),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductsDocumentRepository,
    },
  ],
  exports: [ProductRepository],
})
export class DocumentPersistenceModule {}
