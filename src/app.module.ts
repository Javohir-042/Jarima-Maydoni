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
import { AlertsModule } from './alerts/alerts.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { FinesModule } from './fines/fines.module';
import { StorageRatesModule } from './storage_rates/storage_rates.module';
import { LogsModule } from './logss/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImpoundRecordsModule } from './impound_records/impound_records.module';
import { MediaFilesModule } from './media_files/media_files.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    VehiclesModule,
    InfractionTypesModule,
    ReportsModule,
    LocationsModule,
    NotificationsModule,
    StaffModule,
    TowTrucksModule,
    AlertsModule,
    MaintenanceModule,
    FinesModule,
    LogsModule,
    StorageRatesModule,
    ImpoundRecordsModule,
    MediaFilesModule,
    PaymentsModule,
  ],
}) 
export class AppModule { }
