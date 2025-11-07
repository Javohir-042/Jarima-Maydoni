import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class CreateReportDto {
    @ApiProperty({
        description: "Reportni kim yaratdi (user_id)",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty({ message: "generated_by maydoni bo‘sh bo‘lishi mumkin emas" })
    generated_by: number;

    @ApiProperty({
        description: 'Report turi, masalan: "monthly", "daily" yoki "yearly"',
        example: "monthly",
    })
    @IsString()
    @IsNotEmpty({ message: "report_type maydoni bo‘sh bo‘lishi mumkin emas" })
    report_type: string;

    @ApiProperty({
        description: "Report ma'lumotlari JSON string ko'rinishida",
        example: '{"total_sales": 1000, "total_users": 50}',
    })
    @IsString()
    @IsNotEmpty({ message: "data maydoni bo‘sh bo‘lishi mumkin emas" })
    data: string;
}
