import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ImpoundRecordsService } from './impound_records.service';
import { CreateImpoundRecordDto } from './dto/create-impound_record.dto';
import { UpdateImpoundRecordDto } from './dto/update-impound_record.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Impound-records')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('impound-records')
export class ImpoundRecordsController {
  constructor(private readonly impoundRecordsService: ImpoundRecordsService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createImpoundRecordDto: CreateImpoundRecordDto) {
    return this.impoundRecordsService.create(createImpoundRecordDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get()
  findAll() {
    return this.impoundRecordsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.impoundRecordsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImpoundRecordDto: UpdateImpoundRecordDto) {
    return this.impoundRecordsService.update(+id, updateImpoundRecordDto);
  }

  @Roles( Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.impoundRecordsService.remove(+id);
  }
}
