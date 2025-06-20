import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { CategoryDocumentRepository } from './infrastructure/persistence/document/repositories/categories.repository';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import {
  CategorySchemaClass,
  CategorySchema,
} from './infrastructure/persistence/document/entities/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategorySchemaClass.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryDocumentRepository,
    { provide: CategoryRepository, useExisting: CategoryDocumentRepository },
  ],
  exports: [CategoryService, CategoryDocumentRepository, CategoryRepository],
})
export class CategoryModule {}
