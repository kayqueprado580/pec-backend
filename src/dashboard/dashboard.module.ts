
import { Module } from '@nestjs/common';
import { CategoryService } from 'src/categories/categories.service';
import { RegisterService } from 'src/registers/registers.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from 'src/database/prisma.service';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [PrismaService, CategoryService, RegisterService, DashboardService]
})
export class DashboardModule {}
