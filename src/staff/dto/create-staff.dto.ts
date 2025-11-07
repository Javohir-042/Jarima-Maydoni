import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateStaffDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    location_id: number;

    @ApiProperty({ example: "Inspector" })
    @IsString()
    position: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    user_id: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    shift_start: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    shift_end: Date;
}
