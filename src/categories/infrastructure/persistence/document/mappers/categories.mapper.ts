import { Category } from '../../../../domain/category';
import { CategorySchemaClass } from '../entities/categories.schema';

// mapper dùng để chuyển đổi dữ liệu từ domain sang persistence và ngược lại
export class CategoryMapper {
  static toDomain(raw: CategorySchemaClass): Category {
    const domainEntity = new Category();
    domainEntity.id = raw._id?.toString() || raw._id;
    domainEntity.name = raw.name;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(category: Category): CategorySchemaClass {
    const schema = new CategorySchemaClass();
    schema.name = category.name;
    schema.createdAt = category.createdAt;
    schema.updatedAt = category.updatedAt;
    return schema;
  }
}
