import { IsInt, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMediaFileDto {
    @ApiPropertyOptional({ description: 'Jarima ID', example: 5 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    fine_id?: number;

    @ApiPropertyOptional({ description: 'Record ID', example: 10 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    record_id?: number;

    @ApiProperty({ description: 'Fayl yo\'ti', example: 'uploads/file.jpg' })
    @IsString()
    @MaxLength(255)
    file_path: string;

    @ApiProperty({ description: 'Fayl turi', example: 'image/jpeg' })
    @IsString()
    @MaxLength(50)
    file_type: string;

    @ApiProperty({ description: 'Yuklagan user ID', example: 1 })
    @IsInt()
    @Type(() => Number)
    uploaded_by: number;

    @ApiPropertyOptional({ description: 'Amal qilish muddati', example: '2025-12-31' })
    @IsOptional()
    @IsDateString()
    effective_to?: string;
}