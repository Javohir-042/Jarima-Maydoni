import { IsNumber, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAlertDto {
    @ApiProperty({ example: 0, description: "Alert qo'yiladigan joy ID" })
    @IsNumber()
    location_id: number;

    @ApiProperty({ example: "speed", description: "Alert turi" })
    @IsString()
    @IsNotEmpty()
    alert_type: string;

    @ApiProperty({ example: "Ushbu hududda tezlik oshmoqda", description: "Alert tavsifi" })
    @IsString()
    @IsNotEmpty()
    description: string;
}
