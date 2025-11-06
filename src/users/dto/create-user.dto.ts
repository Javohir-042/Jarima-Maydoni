import { Role } from "../../common/enum/Role.enum";
import { IsString, IsEnum, IsOptional, Length, IsPhoneNumber, IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User full name', minLength: 3, maxLength: 100, example: 'Javohir Quromboyev' })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({ description: 'Phone number in format 998901234567', example: '998976006787' })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('UZ')
    phone_number: string;

    @ApiProperty({ description: 'User email address', example: 'javohirquromboyev933@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password', minLength: 6, maxLength: 255, example: 'Javohir123!' })
    @IsStrongPassword()
    @IsNotEmpty()
    @Length(6, 255)
    password: string;

    @ApiProperty({ enum: Role, description: 'User role', default: Role.USER, example: Role.USER })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;

    @ApiPropertyOptional({ description: 'Region name', minLength: 3, maxLength: 100, example: 'Tashkent' })
    @IsOptional()
    @IsString()
    @Length(3, 100)
    region?: string;
}
