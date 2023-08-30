import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	type: string;

	@IsString()
	value: string;

	@IsNotEmpty()
	date: Date;

	@IsBoolean()
	pago: boolean;

	@IsNumber()
	categoryId: number;

	@IsString()
	description: string;
}