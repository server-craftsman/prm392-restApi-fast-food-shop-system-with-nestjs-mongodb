import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './entities/categories.schema';
import { CategoryDocumentRepository } from './repositories/categories.repository';
import { CategoryRepository } from '../category.repository';
import { COLLECTION_PATH } from '../../../../utils/collection.path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COLLECTION_PATH.CATEGORY, schema: CategorySchema },
    ]),
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
