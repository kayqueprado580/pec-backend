import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CategoriesModule } from './categories/categories.module';
import { RegistersModule } from './registers/registers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    CategoriesModule,
    RegistersModule,
  ],
  controllers: [AuthController, AppController],
  providers: [AppService],
})
export class AppModule { }
