import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InfractionTypesService } from './infraction_types.service';
import { CreateInfractionTypeDto } from './dto/create-infraction_type.dto';
import { UpdateInfractionTypeDto } from './dto/update-infraction_type.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';
import { Public } from '../common/decorator';


@ApiTags('Infraction-types')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('infraction-types')
export class InfractionTypesController {
  constructor(private readonly infractionTypesService: InfractionTypesService) { }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(@Body() createInfractionTypeDto: CreateInfractionTypeDto) {
    return this.infractionTypesService.create(createInfractionTypeDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get()
  findAll() {
    return this.infractionTypesService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infractionTypesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInfractionTypeDto: UpdateInfractionTypeDto) {
    return this.infractionTypesService.update(+id, updateInfractionTypeDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infractionTypesService.remove(+id);
  }
}
