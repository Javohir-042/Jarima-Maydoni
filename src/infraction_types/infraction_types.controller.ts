import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InfractionTypesService } from './infraction_types.service';
import { CreateInfractionTypeDto } from './dto/create-infraction_type.dto';
import { UpdateInfractionTypeDto } from './dto/update-infraction_type.dto';

@Controller('infraction-types')
export class InfractionTypesController {
  constructor(private readonly infractionTypesService: InfractionTypesService) {}

  @Post()
  create(@Body() createInfractionTypeDto: CreateInfractionTypeDto) {
    return this.infractionTypesService.create(createInfractionTypeDto);
  }

  @Get()
  findAll() {
    return this.infractionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infractionTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInfractionTypeDto: UpdateInfractionTypeDto) {
    return this.infractionTypesService.update(+id, updateInfractionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infractionTypesService.remove(+id);
  }
}
