import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDTO {
    id?: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}