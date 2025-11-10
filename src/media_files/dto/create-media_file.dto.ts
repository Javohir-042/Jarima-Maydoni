import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateMediaFileDto {
    @ApiProperty({ required: false, description: 'Tegishli jarima ID' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    fine_id?: number;

    @ApiProperty({ required: false, description: 'Tegishli saqlash yozuvi ID' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    record_id?: number;

    @ApiProperty({ description: 'Faylni yuklagan foydalanuvchi ID' })
    @Type(() => Number)
    @IsNumber()
    uploaded_by: number;

    @ApiProperty({ required: false, format: 'date-time', description: 'Faylning amal qilish muddati' })
    @IsOptional()
    @IsDateString()
    effective_to?: Date;
}
