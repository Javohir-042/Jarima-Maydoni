import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateLogDto {
    @ApiProperty({ example: 5, description: "Log yozayotgan user ID" })
    @IsInt({ message: "user_id butun son bo'lishi kerak" })
    user_id: number;

    @ApiProperty({ example: "CREATE_FINE", description: "Amal turi (action)" })
    @IsString({ message: "action matn bo'lishi kerak" })
    @IsNotEmpty({ message: "action kiritilishi shart" })
    action: string;

    @ApiProperty({ example: "Foydalanuvchi yangi jarima qo'shdi", description: "Log tafsiloti" })
    @IsString({ message: "details matn bo'lishi kerak" })
    details: string;
}
