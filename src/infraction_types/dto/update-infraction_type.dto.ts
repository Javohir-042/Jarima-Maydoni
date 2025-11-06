import { PartialType } from '@nestjs/swagger';
import { CreateInfractionTypeDto } from './create-infraction_type.dto';

export class UpdateInfractionTypeDto extends PartialType(CreateInfractionTypeDto) {}
