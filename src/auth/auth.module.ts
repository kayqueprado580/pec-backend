import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
	imports: [UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3000s' },
		}),
	],
	providers: [AuthService, UsersService, PrismaService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule { }
