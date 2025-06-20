import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './entities/categories.schema';
import { CategoryDocumentRepository } from './repositories/categories.repository';
import { CategoryRepository } from '../category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  providers: [
    {
      provide: CategoryRepository,
      useClass: CategoryDocumentRepository,
    },
  ],
  exports: [CategoryRepository],
})
export class DocumentPersistenceModule {}
