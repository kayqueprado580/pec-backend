import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto'
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) { }

	@Get()
	async findAll() {
		return await this.usersService.findAll()
	}

	@Post()
	async create(@Body() data: UserDTO) {
		try {
			return await this.usersService.create(data);
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.FORBIDDEN,
				error: error.message,
			}, HttpStatus.FORBIDDEN, {
				cause: error
			});
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			return await this.usersService.findOne(+id)
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.NOT_FOUND,
				error: error.message,
			}, HttpStatus.NOT_FOUND, {
				cause: error
			});
		}
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() userDTO: UserDTO) {
		try {
			return await this.usersService.update(+id, userDTO)
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.FORBIDDEN,
				error: error.message,
			}, HttpStatus.FORBIDDEN, {
				cause: error
			});
		}
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			await this.usersService.remove(+id)
			return { "message": "successfully removed" }
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.NOT_FOUND,
				error: error.message,
			}, HttpStatus.NOT_FOUND, {
				cause: error
			});
		}
	}
}
