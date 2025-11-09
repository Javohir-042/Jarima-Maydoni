import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
    IsNumber,
    IsDateString
} from 'class-validator';
import { FinesStatus } from '../../common/enum/fines.enum';

export class CreateFineDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    vehicle_id: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    infraction_type_id: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    inspector_id: number;

    @ApiProperty({ example: 'FINE-2025-00123' })
    @IsString()
    @IsNotEmpty()
    fine_number: string;

    @ApiProperty({ example: 500000 })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    @IsOptional()
    paid_amount?: number;

    @ApiProperty({ example: 'Toshkent, Chilonzor tumani' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: FinesStatus.PENDING, enum: FinesStatus })
    @IsEnum(FinesStatus)
    @IsOptional()
    status?: FinesStatus;

    @ApiProperty({ example: '2025-11-07T10:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    fine_date: string;

    @ApiProperty({ example: '2025-12-07T10:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    due_date: string;

    @ApiProperty({ example: 'Foydalanuvchi tezlikni oshirgan' })
    @IsString()
    @IsOptional()
    notes?: string;
}
