import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/Role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Roles(Role.SUPERADMIN)
  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }


  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
