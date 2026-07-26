import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IncomeDocument = Income & Document;

@Schema({ timestamps: true, collection: 'incomes' })
export class Income {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, min: 0.01 })
  amount: number;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, type: Date, default: Date.now, index: true })
  date: Date;

  @Prop({ trim: true, default: 'General Income' })
  source: string;

  // Soft Delete fields
  @Prop({ required: true, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  // Audit Fields
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);

// Compound performance & filtering indexes
IncomeSchema.index({ userId: 1, isDeleted: 1, date: -1 });
IncomeSchema.index({ userId: 1, categoryId: 1, isDeleted: 1 });
IncomeSchema.index({
  userId: 1,
  title: 'text',
  description: 'text',
  source: 'text',
});
