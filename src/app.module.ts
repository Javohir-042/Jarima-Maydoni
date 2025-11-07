import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './Prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SessionsModule } from './sessions/sessions.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { InfractionTypesModule } from './infraction_types/infraction_types.module';
import { ReportsModule } from './reports/reports.module';
import { LocationsModule } from './locations/locations.module';
import { StaffModule } from './staff/staff.module';
import { TowTrucksModule } from './tow_trucks/tow_trucks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    SessionsModule,
    VehiclesModule,
    InfractionTypesModule,
    ReportsModule,
    LocationsModule,
    StaffModule,
    TowTrucksModule,
  ],
})
export class AppModule { }
