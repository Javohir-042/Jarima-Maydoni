import { Module } from '@nestjs/common';
import { FinesService } from './fines.service';
import { FinesController } from './fines.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [FinesController],
  providers: [FinesService, PrismaService],
})
export class FinesModule {}
