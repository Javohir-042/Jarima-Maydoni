import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, title, message, is_read } = createNotificationDto

    const user = await this.prisma.users.findUnique({
      where: { id: userId }
    })

    if (userId === 1) {
      throw new ForbiddenException('User id not found');
    }

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return await this.prisma.notifications.create({
      data: {
        user_id: userId,
        title,
        message,
        is_read
      }
    })
  }

  async findAll() {
    return await this.prisma.notifications.findMany({ include: { user: true } });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id }, include: { user: true }
    });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);

    if (updateNotificationDto.userId && updateNotificationDto.userId === 1) {
      throw new ForbiddenException(`User id not found`);
    }

    const { userId, ...rest } = updateNotificationDto;

    return await this.prisma.notifications.update({
      where: { id },
      data: {
        ...rest,
        ...(userId ? { user_id: userId } : {}),
      },
    });
  }


  async remove(id: number) {
    const notification = await this.findOne(id);

    await this.prisma.notifications.delete({
      where: { id },
    });

    return { message: "Notification o'chirildi" };
  }

}
