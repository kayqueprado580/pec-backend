import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Module({
	imports: [],
	controllers: [
		UsersController,],
	providers: [UsersService, PrismaService],
	exports: [UsersService]
})
export class UsersModule { }
