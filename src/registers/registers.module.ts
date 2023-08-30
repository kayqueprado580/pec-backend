
import { Module } from '@nestjs/common';
import { RegisterService } from './registers.service';
import { RegisterController } from './registers.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [RegisterController],
  providers: [PrismaService, RegisterService]
})
export class RegistersModule {}
