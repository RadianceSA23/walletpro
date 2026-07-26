import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  // Null for system-default categories shared across all users
  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  userId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: CategoryType, index: true })
  type: CategoryType;

  @Prop({ required: true, default: '#6366F1' })
  color: string;

  @Prop({ required: true, default: 'tag' })
  icon: string;

  @Prop({ required: true, default: false })
  isSystem: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Compound indexes for user custom + system category queries
CategorySchema.index({ userId: 1, type: 1 });
CategorySchema.index({ isSystem: 1, type: 1 });
CategorySchema.index({ name: 'text' });
