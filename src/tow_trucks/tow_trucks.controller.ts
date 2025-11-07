// src/tow-trucks/tow-trucks.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guard/access-token.guard';
import { GetCurrentUserId } from '../common/decorator/get-current-user-id.decorator';
import { TowTrucksService } from './tow_trucks.service';
import { CreateTowTruckDto } from './dto/create-tow_truck.dto';
import { UpdateTowTruckDto } from './dto/update-tow_truck.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/Role.enum';


@ApiTags('Tow_trucks')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('tow-trucks')
export class TowTrucksController {
  constructor(private readonly service: TowTrucksService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(
    @Body() dto: CreateTowTruckDto,
    @GetCurrentUserId() userId: number
  ) {
    return this.service.create(dto, userId);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTowTruckDto,
    @GetCurrentUserId() userId: number
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number
  ) {
    return this.service.remove(+id, userId);
  }
}
