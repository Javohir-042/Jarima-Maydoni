import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from "class-validator";
import { RateType } from "../../common/enum/Storage_rates.enum";

export class CreateStorageRateDto {
    @ApiProperty({ description: "Rate type, e.g., HOURLY, MONTHLY", example: "DAILY" })
    @IsEnum(RateType)
    rate_type: RateType;

    @ApiProperty({ description: "Amount of the rate", example: 1000 })
    @IsNumber()
    @Min(0, { message: "Amount manfiy bo'lishi mumkin emas" })
    amount: number;

    @ApiProperty({ description: "Currency of the rate", example: "USD" })
    @IsString()
    currency: string;

    @ApiPropertyOptional({ description: "Optional description of the rate", example: "Special winter rate" })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: "Effective start date", example: "2025-11-08" })
    @IsDateString()
    effective_from: string;

    @ApiProperty({ description: "Effective end date", example: "2026-11-08" })
    @IsDateString()
    effective_to: string;
}
