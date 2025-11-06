import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninUserDto {
    @ApiProperty({
        description: 'Foydalanuvchi email manzili',
        example: 'javohirquromboyev933@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Foydalanuvchi paroli, minimal uzunligi 6 ta belgi',
        example: 'Javohir123!',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
