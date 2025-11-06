import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './Prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SessionsModule } from './sessions/sessions.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { InfractionTypesModule } from './infraction_types/infraction_types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    SessionsModule,
    VehiclesModule,
    InfractionTypesModule
  ],
})
export class AppModule { }
