import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateNotificationDto {
    @ApiProperty({ description: 'Yangilanishi kerak bo‘lgan infractionType ID', example: 3 })
    @IsNumber()
    @IsNotEmpty()
    infractionId: number;
}
