import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from './schemas/income.schema';
import { IncomeRepository } from './repositories/income.repository';
import { IncomeService } from './services/income.service';
import { IncomeController } from './controllers/income.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
    CategoriesModule,
  ],
  controllers: [IncomeController],
  providers: [IncomeService, IncomeRepository],
  exports: [IncomeService, IncomeRepository],
})
export class IncomeModule {}
