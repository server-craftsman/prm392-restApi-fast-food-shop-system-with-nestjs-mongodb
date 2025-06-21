import { Product } from '../../../../domain/product';
import { ProductSchemaClass } from '../entities/products.schema';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { Types } from 'mongoose';

export class ProductMapper {
    static toDomain(raw: ProductSchemaClass): Product {
        const domainEntity = new Product();
        domainEntity.id = raw._id?.toString();
        domainEntity.name = raw.name;
        domainEntity.description = raw.description;
        domainEntity.price = raw.price;
        domainEntity.categoryId = raw.categoryId?.toString();

        domainEntity.images = raw.images?.map(image => FileMapper.toDomain(image)) || [];

        domainEntity.brand = raw.brand;
        domainEntity.weight = raw.weight;
        domainEntity.ingredients = raw.ingredients;
        domainEntity.nutritionFacts = raw.nutritionFacts;
        domainEntity.expiryDate = raw.expiryDate;
        domainEntity.origin = raw.origin;
        domainEntity.packaging = raw.packaging;
        domainEntity.storageInstructions = raw.storageInstructions;
        domainEntity.usageInstructions = raw.usageInstructions;
        domainEntity.isVegetarian = raw.isVegetarian;
        domainEntity.isVegan = raw.isVegan;
        domainEntity.allergens = raw.allergens;
        domainEntity.servingSize = raw.servingSize;
        domainEntity.countryOfManufacture = raw.countryOfManufacture;
        domainEntity.rating = raw.rating;
        domainEntity.stock = raw.stock;

        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;
        return domainEntity;
    }

    static toPersistence(domainEntity: Product): ProductSchemaClass {
        const persistenceEntity = new ProductSchemaClass();
        if (domainEntity.id) {
            persistenceEntity._id = domainEntity.id.toString();
        }
        persistenceEntity.name = domainEntity.name;
        persistenceEntity.description = domainEntity.description || '';
        persistenceEntity.price = domainEntity.price;
        persistenceEntity.categoryId = new Types.ObjectId(domainEntity.categoryId);

        persistenceEntity.images = domainEntity.images?.map(image => FileMapper.toPersistence(image)) || [];

        persistenceEntity.brand = domainEntity.brand || '';
        persistenceEntity.weight = domainEntity.weight || '';
        persistenceEntity.ingredients = domainEntity.ingredients || '';
        persistenceEntity.nutritionFacts = domainEntity.nutritionFacts || '';
        persistenceEntity.expiryDate = domainEntity.expiryDate || new Date();
        persistenceEntity.origin = domainEntity.origin || '';
        persistenceEntity.packaging = domainEntity.packaging || '';
        persistenceEntity.storageInstructions = domainEntity.storageInstructions || '';
        persistenceEntity.usageInstructions = domainEntity.usageInstructions || '';
        persistenceEntity.isVegetarian = domainEntity.isVegetarian || false;
        persistenceEntity.isVegan = domainEntity.isVegan || false;
        persistenceEntity.allergens = domainEntity.allergens || '';
        persistenceEntity.servingSize = domainEntity.servingSize || '';
        persistenceEntity.countryOfManufacture = domainEntity.countryOfManufacture || '';
        persistenceEntity.rating = domainEntity.rating || 0;
        persistenceEntity.stock = domainEntity.stock || 0;

        persistenceEntity.createdAt = domainEntity.createdAt || new Date();
        persistenceEntity.updatedAt = domainEntity.updatedAt || new Date();
        persistenceEntity.deletedAt = domainEntity.deletedAt || new Date();
        return persistenceEntity;
    }
}
