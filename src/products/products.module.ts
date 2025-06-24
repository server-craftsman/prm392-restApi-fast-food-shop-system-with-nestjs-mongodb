import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { FilesModule } from '../files/files.module';
import { DocumentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentPersistenceModule, FilesModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, DocumentPersistenceModule],
})
export class ProductsModule {}
