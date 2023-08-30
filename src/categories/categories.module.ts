import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryController } from './categories.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService]
})
export class CategoriesModule {}
