
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from './dto/register.dto';
import { endOfMonth, startOfMonth } from 'date-fns'

@Injectable()
export class RegisterService {

	constructor(private prisma: PrismaService) { }

	async create(data: RegisterDTO, userId: number) {

		await this.checkCategoryExists(data.categoryId);

		const register = await this.prisma.register.create({
			data: {
				...data,
				userId: userId,
			},
		})

		return {
			register
		}
	}


	async findAll(skip: number, take: number, orderBy: boolean, userId: number, startDate?: Date, endDate?: Date) {

		const dates = this.checkDates(startDate, endDate);

		return await this.prisma.register.findMany({
			skip: skip ? skip : 0,
			take: take ? take : 20,
			orderBy: {
				id: orderBy ? 'asc' : 'desc',
			},
			where: {
				userId: userId,
				date: {
					gte: dates.startDate,
					lte: dates.endDate,
				},
			}
		})
	}

	async findOne(id: number) {
		const registerExists = await this.checkRegisterExists(id)
		if (!registerExists) {
			throw new Error("Register does not exists!");
		}

		return await this.prisma.register.findUnique({
			where: {
				id,
			}
		})
	}

	async update(id: number, data: RegisterDTO, userId: number) {
		const registerExists = await this.checkRegisterExists(id)
		if (!registerExists) {
			throw new Error("Register does not exists!");
		}

		await this.checkCategoryExists(data.categoryId);

		return await this.prisma.register.update({
			data: {
				...data,
				userId: userId,
			},
			where:
			{
				id,
			}
		})
	}

	async remove(id: number) {
		const registerExists = await this.checkRegisterExists(id)
		if (!registerExists) {
			throw new Error("Register does not exists!");
		}

		return await this.prisma.register.delete({
			where: {
				id,
			}
		})
	}

	async getRegistersDashboard(userId: number, startDate?: Date, endDate?: Date) {
		const dates = this.checkDates(startDate, endDate);
		return await this.prisma.register.findMany({
			where: {
				userId: userId,
				date: {
					gte: dates.startDate,
					lte: dates.endDate,
				},
			}
		})
	}

	private checkDates(start: Date, end: Date) {
		let startDate = start;
		let endDate = end;

		if (!start || isNaN(start.getTime()))
			startDate = startOfMonth(new Date())

		if (!end || isNaN(end.getTime()))
			endDate = endOfMonth(new Date())

		if (endDate <= startDate)
			throw new Error('The end date must be greater than the start date!');


		return {
			startDate: startDate,
			endDate: endDate
		}
	}

	private async checkRegisterExists(id: number) {
		const registerExists = await this.prisma.register.findUnique({
			where: {
				id,
			}
		})
		const exists = registerExists ? true : false
		return exists
	}

	private async checkCategoryExists(categoryId: number) {
		const categoryExists = await this.prisma.category.findUnique({
			where: {
				id: categoryId,
			},
		});

		if (!categoryExists) {
			throw new NotFoundException('Category does not exists!');
		}
	}

}
