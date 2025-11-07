import { Module } from '@nestjs/common';
import { TowTrucksService } from './tow_trucks.service';
import { TowTrucksController } from './tow_trucks.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [TowTrucksController],
  providers: [TowTrucksService, PrismaService],
})
export class TowTrucksModule {}
