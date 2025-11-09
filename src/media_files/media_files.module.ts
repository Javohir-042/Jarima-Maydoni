import { Module } from '@nestjs/common';
import { MediaFilesService } from './media_files.service';
import { MediaFilesController } from './media_files.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [MediaFilesController],
  providers: [MediaFilesService, PrismaService],
})
export class MediaFilesModule {}
