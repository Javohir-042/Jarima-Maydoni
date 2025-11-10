import { Controller, Get, Post, Param, Patch, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Notifications')
@ApiBearerAuth() 
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) { }


  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('send/infraction/:userId/:infractionId')
  async sendInfraction(
    @Param('userId') userId: number,
    @Param('infractionId') infractionId: number,
  ) {
    const notification = await this.notificationService.sendInfractionNotification(
      Number(userId),
      Number(infractionId),
    );
    return { ...notification };
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('all')
  async findAll() {
    return this.notificationService.findAllNotifications();
  }


  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Get('read/:notificationId')
  async markRead(@Param('notificationId') notificationId: number) {
    return this.notificationService.markAsRead(notificationId);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch('update-infraction/:notificationId')
  async updateInfraction(
    @Param('notificationId') notificationId: number,
    @Body() body: UpdateNotificationDto,
  ) {
    const { infractionId } = body;
    return this.notificationService.updateInfraction(Number(notificationId), infractionId);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':notificationId')
  async delete(@Param('notificationId') notificationId: number) {
    return this.notificationService.deleteNotification(Number(notificationId));
  }
}
