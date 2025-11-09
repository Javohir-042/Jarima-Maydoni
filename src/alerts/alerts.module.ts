import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService],
})
export class AlertsModule {}
