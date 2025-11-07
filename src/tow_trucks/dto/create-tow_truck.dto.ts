// src/tow-trucks/dto/create-tow-truck.dto.ts
import { IsString, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TowTruckStatus } from '../../common/enum/tow-truck-status.enum';

export class CreateTowTruckDto {
    @ApiProperty({ example: '01T123AA' })
    @IsString()
    reg_number: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    driver_name: string;

    @ApiProperty({ example: '+998901234567' })
    @IsPhoneNumber('UZ')
    driver_phone: string;

    @ApiPropertyOptional({
        enum: TowTruckStatus,
        default: TowTruckStatus.AVAILABLE
    })
    @IsOptional()
    @IsEnum(TowTruckStatus)
    status?: TowTruckStatus;
}