import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
    @ApiProperty({ description: 'Foydalanuvchi ID', example: 1 })
    @IsNumber()
    user_id: number;

    @ApiProperty({ description: 'Foydalanuvchi qurilma va brauzer haqida ma\'lumot', example: 'Chrome, Windows 10' })
    @IsString()
    device_info: string;
}
