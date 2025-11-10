import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly prisma: PrismaService) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      this.logger.error('EMAIL_USER va EMAIL_PASS .env faylda aniqlanmagan');
      throw new Error('EMAIL_USER va EMAIL_PASS .env faylda aniqlanmagan');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendInfractionNotification(userId: number, infractionId: number) {
    
    const user = await this.prisma.users.findUnique({ where: { id: userId } }); 
    if (!user) throw new NotFoundException('User_id topilmadi');

    const infraction = await this.prisma.infraction_types.findUnique({
      where: { id: infractionId },
    });
    if (!infraction) throw new NotFoundException('Infraction_id turi topilmadi');

    const title = `Jarima: ${infraction.name}`;
    const message = `Hurmatli ${user.full_name},\n\nSizga quyidagi jarima qo‘yildi:\n- Jarima turi: ${infraction.name}\n- Tavsif: ${infraction.description}\n- Modda: ${infraction.law_reference}\n- Jarima summasi: ${infraction.base_fine_amount} so'm`;

    await this.prisma.notifications.create({
      data: {
        user_id: userId,
        title,
        message,
      },
    });

    await this.transporter.sendMail({
      from: `"Jarima Maydoni" <${process.env.EMAIL_USER}>`,
      to: user.email!, 
      subject: title,
      text: message,
    });


    return { userId, title, message };
  }

  async findAllNotifications() {
    const notifications = await this.prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
    });

    const uniqueUserIds = new Set(notifications.map(n => n.user_id));

    return {
      totalNotifications: notifications.length,
      totalUsers: uniqueUserIds.size,
      notifications,
    };
  }


  async markAsRead(notificationId: number) {
    try {
      const notification = await this.prisma.notifications.update({
        where: { id: notificationId },
        data: { is_read: true },
      });
      this.logger.log(`Notification o'qilgan belgilandi: ${notificationId}`);
      return notification;
    } catch (error) {
      this.logger.error(`Notificationni o'qilgan deb belgilashda xato: ${notificationId}`, error);
      throw error;
    }
  }

  async getUserNotifications(userId: number) {
    try {
      return await this.prisma.notifications.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Foydalanuvchi notificationlarini olishda xato: ${userId}`, error);
      throw error;
    }
  }

  async updateInfraction(notificationId: number, infractionId: number) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id: notificationId },
    });
    if (!notification) throw new NotFoundException('Notification topilmadi');

    const infraction = await this.prisma.infraction_types.findUnique({
      where: { id: infractionId },
    });
    if (!infraction) throw new NotFoundException('Jarima turi topilmadi');

    const updatedTitle = `Jarima: ${infraction.name}`;
    const updatedMessage = `Hurmatli foydalanuvchi, sizga quyidagi jarima qo'yildi:\n- Jarima turi: ${infraction.name}\n- Tavsif: ${infraction.description}\n- Modda: ${infraction.law_reference}\n- Jarima summasi: ${infraction.base_fine_amount} so'm`;

    return this.prisma.notifications.update({
      where: { id: notificationId },
      data: {
        title: updatedTitle,
        message: updatedMessage,
      },
    });
  }

  
  async deleteNotification(notificationId: number) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id: notificationId },
    });
    if (!notification) throw new Error('Notification topilmadi');

    return this.prisma.notifications.delete({
      where: { id: notificationId },
    });
  }


}
