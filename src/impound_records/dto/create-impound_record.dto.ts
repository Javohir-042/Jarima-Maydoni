import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImpoundRecordDto {
    @ApiProperty({ description: 'ID of the fine' })
    @IsNumber()
    fine_id: number;

    @ApiProperty({ description: 'ID of the vehicle' })
    @IsNumber()
    vehicle_id: number;

    @ApiPropertyOptional({ description: 'ID of the tow truck' })
    @IsOptional()
    @IsNumber()
    tow_truck_id?: number;

    @ApiPropertyOptional({ description: 'ID of the location' })
    @IsOptional()
    @IsNumber()
    location_id?: number;

    @ApiPropertyOptional({ description: 'ID of the storage rate' })
    @IsOptional()
    @IsNumber()
    storage_rate_id?: number;

    @ApiProperty({ description: 'ID of the staff who impounded the vehicle' })
    @IsNumber()
    impound_by: number;

    @ApiPropertyOptional({ description: 'ID of the admin/superadmin who released the vehicle' })
    @IsOptional()
    @IsNumber()
    released_by?: number;

    @ApiPropertyOptional({ description: 'Datetime when the vehicle was impounded'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    impounded_at?: Date;

    @ApiPropertyOptional({ description: 'Datetime when the vehicle was released'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    released_at?: Date;

    @ApiPropertyOptional({ description: 'Status of the record', example: 'IMPOUNDED' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: 'Additional notes' })
    @IsOptional()
    @IsString()
    notes?: string;
}
