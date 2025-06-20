import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type CategorySchemaDocument = HydratedDocument<CategorySchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class CategorySchemaClass extends EntityDocumentHelper {
  @Prop({ type: String, required: true })
  name: string | null;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date | undefined;
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date | undefined;
}

export const CategorySchema = SchemaFactory.createForClass(CategorySchemaClass);
