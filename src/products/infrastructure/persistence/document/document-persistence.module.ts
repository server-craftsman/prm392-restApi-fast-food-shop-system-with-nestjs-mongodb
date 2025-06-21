import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductSchemaClass } from './entities/products.schema';
import { ProductRepository } from '../product.repository';
import { ProductsDocumentRepository } from './repositories/products.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
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
