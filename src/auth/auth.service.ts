import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
	) { }

	async signIn(username, pass) {
		const user = await this.userService.findOneByToken(username);

		if (user) {
			const isPasswordValid = await this.userService.comparePwd(pass, user.password)
			if (!isPasswordValid) {
				throw new UnauthorizedException(
					'Password provided is incorrect.',
				);
			}
			const payload = { sub: user.id, username: user.username };
			return {
				access_token: await this.jwtService.signAsync(payload),
			}
		}

		throw new UnauthorizedException(
			'Username or password provided is incorrect.',
		);

	}

}
