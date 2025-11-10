import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';


@ApiTags("Reports  => Jarimalar bo'yicha umumiy hisobotlar")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
 
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
