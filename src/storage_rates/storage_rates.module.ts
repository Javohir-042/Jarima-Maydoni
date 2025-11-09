import { Module } from '@nestjs/common';
import { StorageRatesService } from './storage_rates.service';
import { StorageRatesController } from './storage_rates.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [StorageRatesController],
  providers: [StorageRatesService, PrismaService ],
})
export class StorageRatesModule {}
