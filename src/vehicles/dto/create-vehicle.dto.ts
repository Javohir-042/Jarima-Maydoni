import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateVehicleDto {
    @ApiProperty({ description: 'Foydalanuvchi ID', example: 1 })
    @IsNumber()
    user_id: number;

    @ApiProperty({ description: 'Avtomobil davlat raqami', example: '01A777AA' })
    @IsString()
    plate_number: string;

    @ApiProperty({ description: 'Avtomobil brendi', example: 'Chevrolet' })
    @IsString()
    brand: string;

    @ApiProperty({ description: 'Avtomobil modeli', example: 'Malibu 2' })
    @IsString()
    model: string;

    @ApiProperty({ description: 'Avtomobil rangi', example: 'Qora' })
    @IsString()
    color: string;

    @ApiProperty({ description: 'Ishlab chiqarilgan yil', example: 2023 })
    @IsNumber()
    year: number;

    @ApiProperty({ description: 'Avtomobil VIN kodi', example: '1HGCM82633A004352' })
    @IsString()
    vin: string;
}
