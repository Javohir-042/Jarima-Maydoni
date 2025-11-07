import { PartialType } from '@nestjs/swagger';
import { CreateTowTruckDto } from './create-tow_truck.dto';

export class UpdateTowTruckDto extends PartialType(CreateTowTruckDto) {}
