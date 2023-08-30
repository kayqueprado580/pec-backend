import { User } from '../entities/user.entity';
import { IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

export class UserDTO extends User{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(3, 10)
    name: string;

    @IsNotEmpty()
    @Length(3, 10)
    username: string;

    @IsNotEmpty()
    @Length(4, 20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/, {message: 'Password matching expression. Password must be at least 4 characters, no more than 8 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.'})
    password: string;
}


