import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/Role.enum';

@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')      
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);             
  }
}
