import { Module } from '@nestjs/common';
import { InfractionTypesService } from './infraction_types.service';
import { InfractionTypesController } from './infraction_types.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [InfractionTypesController],
  providers: [InfractionTypesService, PrismaService],
})
export class InfractionTypesModule { }
