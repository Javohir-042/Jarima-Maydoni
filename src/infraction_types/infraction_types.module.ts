import { Module } from '@nestjs/common';
import { InfractionTypesService } from './infraction_types.service';
import { InfractionTypesController } from './infraction_types.controller';

@Module({
  controllers: [InfractionTypesController],
  providers: [InfractionTypesService],
})
export class InfractionTypesModule {}
