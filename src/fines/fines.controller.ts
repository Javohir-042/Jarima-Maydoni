import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FinesService } from './fines.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';
import { GetFinesFilterDto } from './dto/get-fines-filter.dto';


@ApiTags('Fines')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createFineDto: CreateFineDto) {
    return this.finesService.create(createFineDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get()
  findAll() {
    return this.finesService.findAll();
  }


  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get('filter')
  @ApiOperation({ summary: 'Jarimalarni filterlash bilan olish' })
  async getFines(@Query() filterDto: GetFinesFilterDto) {
    return this.finesService.getFines(filterDto);
  }


  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.finesService.update(+id, updateFineDto);
  }

  @Roles( Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finesService.remove(+id);
  }



}
