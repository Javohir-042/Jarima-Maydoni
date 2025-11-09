import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StorageRatesService } from './storage_rates.service';
import { CreateStorageRateDto } from './dto/create-storage_rate.dto';
import { UpdateStorageRateDto } from './dto/update-storage_rate.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Storage-rates')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('storage-rates')
export class StorageRatesController {
  constructor(private readonly storageRatesService: StorageRatesService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createStorageRateDto: CreateStorageRateDto) {
    return this.storageRatesService.create(createStorageRateDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get()
  findAll() {
    return this.storageRatesService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageRatesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageRateDto: UpdateStorageRateDto) {
    return this.storageRatesService.update(+id, updateStorageRateDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageRatesService.remove(+id);
  }
}
