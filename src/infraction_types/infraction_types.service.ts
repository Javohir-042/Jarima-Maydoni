import { Injectable } from '@nestjs/common';
import { CreateInfractionTypeDto } from './dto/create-infraction_type.dto';
import { UpdateInfractionTypeDto } from './dto/update-infraction_type.dto';

@Injectable()
export class InfractionTypesService {
  create(createInfractionTypeDto: CreateInfractionTypeDto) {
    return 'This action adds a new infractionType';
  }

  findAll() {
    return `This action returns all infractionTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} infractionType`;
  }

  update(id: number, updateInfractionTypeDto: UpdateInfractionTypeDto) {
    return `This action updates a #${id} infractionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} infractionType`;
  }
}
