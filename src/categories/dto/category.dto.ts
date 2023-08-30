import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}