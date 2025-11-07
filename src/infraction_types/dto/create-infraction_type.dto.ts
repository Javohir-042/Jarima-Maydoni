import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class CreateInfractionTypeDto {
    @ApiProperty({ example: "SPD001", description: "Unikal code" })
    @IsString()
    code: string;

    @ApiProperty({ example: "Tezlikni oshirish", description: "Jarima turi nomi" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Tezlikni ruxsat etilgan chegaradan oshirish" })
    @IsString()
    description: string;

    @ApiProperty({ example: "Ma'muriy kodeks 128-modda", description: "Qonun manbasi" })
    @IsString()
    law_reference: string;

    @ApiProperty({ example: 50000, description: "Asosiy jarima miqdori (so'mda)" })
    @IsNumber()
    base_fine_amount: number;  
}
