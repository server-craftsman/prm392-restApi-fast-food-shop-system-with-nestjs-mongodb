import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
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
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        CategoryDocumentRepository,
        { provide: CategoryRepository, useExisting: CategoryDocumentRepository },
    ],
    exports: [CategoriesService, CategoryDocumentRepository, CategoryRepository],
})
export class CategoriesModule { }
