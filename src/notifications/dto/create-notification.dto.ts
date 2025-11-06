import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional, IsEnum, IsDate, IsUUID, IsNotEmpty, IsNumber } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty({ description: "Foydalanuvchi ID", example: 1 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ description: "Notification sarlavhasi", example: "Yangi xabar" })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: "Notification mazmuni", example: "Sizga yangi xabar keldi" })
    @IsString()
    @IsNotEmpty()
    message: string; 

    @ApiProperty({ description: "Notification o'qilganligi", example: false })
    @IsBoolean()
    is_read: boolean;

}
