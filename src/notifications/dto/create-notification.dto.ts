import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty({ description: "Foydalanuvchi ID", example: 0 })
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
}
