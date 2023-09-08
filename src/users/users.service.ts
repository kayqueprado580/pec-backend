import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findAll() {
		return await this.prisma.user.findMany({})
	}

	async findOne(id: number) {
		const userExists = await this.checkUserExists(id)
		if (!userExists) {
			throw new Error("User does not exists!");
		}

		return await this.prisma.user.findUnique({
			where: {
				id,
			}
		})
	}

	async findOneByToken(username: string) {
		return await this.prisma.user.findUnique({
			where: {
				username,
			}
		})
	}

	async create(userDTO: UserDTO): Promise<User> {
		const userExists = await this.checkAlredyUserOrEmailExists(userDTO.username, userDTO.email)
		if (userExists) {
			throw new Error("User or email exists!");
		}

		const pwdLength = userDTO.password.trim().length;
		if (!userDTO.password || userDTO.password == '' || (pwdLength < 4 || pwdLength > 8)) {
			throw new Error("Password matching expression. Password must be at least 4 characters, no more than 8 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.");
		}

		const hash = await bcrypt.hash(userDTO.password, 10)
		const data: Prisma.UserCreateInput = {
			...userDTO,
			password: hash
		}

		const createdUser = await this.prisma.user.create({ data })

		return {
			...createdUser,
			password: undefined,
		}
	}

	async update(id: number, userDTO: UserDTO): Promise<User> {
		const userFind = await this.findUniqueUser(id)
		if (!userFind) {
			throw new Error("User does not exists!");
		}

		const usernameHasChanged = this.checkHasChanged(userFind.username, userDTO.username)
		if (usernameHasChanged) {
			const alredyUserExists = await this.checkAlredyUserExists(userDTO.username)
			if (alredyUserExists)
				throw new Error("User exists!");
		}

		const emailHasChanged = this.checkHasChanged(userFind.email, userDTO.email)
		if (emailHasChanged) {
			const alredyEmailExists = await this.checkAlredyEmailExists(userDTO.email)
			if (alredyEmailExists)
				throw new Error("Email exists!");
		}

		const data: Prisma.UserUpdateInput = {
			...userDTO
		}

		const updatedUser = await this.prisma.user.update({
			data,
			where:
			{
				id,
			}
		})

		return {
			...updatedUser,
			password: undefined,
		}
	}

	async remove(id: number) {
		const userExists = await this.checkUserExists(id)
		if (!userExists) {
			throw new Error("User does not exists!");
		}

		return await this.prisma.user.delete({
			where: {
				id,
			}
		})
	}

	async comparePwd(password: string, hash: string) {
		return await bcrypt.compare(password, hash);
	}

	private async checkUserExists(id: number) {
		const usrExists = await this.prisma.user.findUnique({
			where: {
				id,
			}
		})
		const exists = usrExists ? true : false
		return exists
	}

	private async checkAlredyUserOrEmailExists(username: string, email: string) {
		const usrExists = await this.prisma.user.findUnique({
			where: {
				username,
			}
		})

		const emailExists = await this.prisma.user.findUnique({
			where: {
				email,
			}
		})

		const exists = usrExists || emailExists ? true : false
		return exists
	}

	private async checkAlredyUserExists(username: string) {
		const usrExists = await this.prisma.user.findUnique({
			where: {
				username,
			}
		})
		return usrExists ? true : false
	}

	private async checkAlredyEmailExists(email: string) {
		const emailExists = await this.prisma.user.findUnique({
			where: {
				email,
			}
		})
		return emailExists ? true : false
	}

	private checkHasChanged(base: string, input: string) {
		if (base != input)
			return true
		return false
	}

	private async findUniqueUser(id: number) {
		return await this.prisma.user.findUnique({
			where: {
				id,
			}
		})
	}

}