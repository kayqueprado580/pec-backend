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
		const userExists = await this.checkUserExists(id)
		if (!userExists) {
			throw new Error("User does not exists!");
		}

		const alredyUserOrEmailExists = await this.checkAlredyUserOrEmailExists(userDTO.username, userDTO.email)
		if (alredyUserOrEmailExists) {
			throw new Error("User or email exists!");
		}

		const hash = await bcrypt.hash(userDTO.password, 10)
		const data: Prisma.UserCreateInput = {
			...userDTO,
			password: hash
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

}