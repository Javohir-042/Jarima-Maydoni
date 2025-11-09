import { PartialType } from '@nestjs/swagger';
import { CreateStorageRateDto } from './create-storage_rate.dto';

export class UpdateStorageRateDto extends PartialType(CreateStorageRateDto) {}
