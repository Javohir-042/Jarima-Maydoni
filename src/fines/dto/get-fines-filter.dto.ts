import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { FinesStatus } from '../../common/enum/fines.enum';

export class GetFinesFilterDto {


    @ApiPropertyOptional({ enum: FinesStatus })
    @IsOptional()
    @IsEnum(FinesStatus)
    status?: FinesStatus;

    @ApiPropertyOptional({ description: "minimal jarima summasi" })
    @IsOptional()
    @Type(() => Number)      // <- shu qo‘shildi
    @IsNumber()
    minAmount?: number;

    @ApiPropertyOptional({ description: "maksimal jarima summasi" })
    @IsOptional()
    @Type(() => Number)      // <- shu qo‘shildi
    @IsNumber()
    maxAmount?: number;

    @ApiPropertyOptional({ description: "boshlang'ich sana" })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: "oxirgi sana" })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: "joylashuv" })
    @IsOptional()
    @IsString()
    location?: string;
}
