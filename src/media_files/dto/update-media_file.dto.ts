import { PartialType } from '@nestjs/swagger';
import { CreateMediaFileDto } from './create-media_file.dto';

export class UpdateMediaFileDto extends PartialType(CreateMediaFileDto) {}
