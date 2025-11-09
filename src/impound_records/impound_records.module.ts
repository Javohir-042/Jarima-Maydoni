import { Module } from '@nestjs/common';
import { ImpoundRecordsService } from './impound_records.service';
import { ImpoundRecordsController } from './impound_records.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [ImpoundRecordsController],
  providers: [ImpoundRecordsService, PrismaService],
})
export class ImpoundRecordsModule {}
