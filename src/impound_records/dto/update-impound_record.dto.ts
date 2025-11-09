import { PartialType } from '@nestjs/swagger';
import { CreateImpoundRecordDto } from './create-impound_record.dto';

export class UpdateImpoundRecordDto extends PartialType(CreateImpoundRecordDto) {}
