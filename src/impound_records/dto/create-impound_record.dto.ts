import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImpoundRecordDto {
    @ApiProperty({
        description: 'ID of the fine',
        example: 1
    })
    @IsNumber()
    fine_id: number;

    @ApiProperty({
        description: 'ID of the vehicle',
        example: 1
    })
    @IsNumber()
    vehicle_id: number;

    @ApiPropertyOptional({
        description: 'ID of the tow truck',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    tow_truck_id?: number;

    @ApiPropertyOptional({
        description: 'ID of the location',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    location_id?: number;

    @ApiPropertyOptional({
        description: 'ID of the storage rate',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    storage_rate_id?: number;

    @ApiProperty({
        description: 'ID of the staff who impounded the vehicle',
        example: 4
    })
    @IsNumber()
    impound_by: number;

    @ApiPropertyOptional({
        description: 'ID of the admin/superadmin who released the vehicle',
        example: 3
    })
    @IsOptional()
    @IsNumber()
    released_by?: number;

    @ApiPropertyOptional({
        description: 'Datetime when the vehicle was impounded',
        example: '2025-11-10T08:45:27.453Z'
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    impounded_at?: Date;

    @ApiPropertyOptional({
        description: 'Datetime when the vehicle was released',
        example: '2025-11-10T10:00:00.000Z'
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    released_at?: Date;

    @ApiPropertyOptional({
        description: 'Status of the record',
        example: 'IMPOUNDED'
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Mashina tezlikni oshirgani uchun tortib olindi'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}
