import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, IsPhoneNumber, Min } from "class-validator";

export class CreateLocationDto {
    @ApiProperty({ description: "Joy nomi", example: "Markaziy stadion" })
    @IsString()
    @IsNotEmpty({ message: "name maydoni bo'sh bo'lishi mumkin emas" })
    name: string;

    @ApiProperty({ description: "Manzil", example: "Toshkent sh., Amir Temur ko'chasi 12" })
    @IsString()
    @IsNotEmpty({ message: "address maydoni bo'sh bo'lishi mumkin emas" })
    address: string;

    @ApiProperty({ description: "Telefon raqam", example: "+998901234567" })
    @IsPhoneNumber("UZ")
    phone: string;

    @ApiProperty({ description: "Sig'imi (capacity)", example: 5000 })
    @IsNumber()
    @Min(1, { message: "capacity 1 dan kam bo'la olmaydi" })
    capacity: number;
}
