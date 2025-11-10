import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MediaFilesService } from './media_files.service';
import { CreateMediaFileDto } from './dto/create-media_file.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Media Files')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('media-files')
export class MediaFilesController {
  constructor(private readonly service: MediaFilesService) { }

  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Post('upload')
  @ApiOperation({ summary: 'Rasm yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Rasm fayli' },
        fine_id: { type: 'number', nullable: true },
        record_id: { type: 'number', nullable: true },
        uploaded_by: { type: 'number' },
        effective_to: { type: 'string', format: 'date-time', nullable: true },
      },
      required: ['file', 'uploaded_by'],
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, 
  }))
  async uploadMemory(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateMediaFileDto,
  ) {
    if (!file) throw new BadRequestException('Rasm yuborilmadi');
    return this.service.create(createDto, file);
  }

  


  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('expired')
  @ApiOperation({ summary: "Muddati o'tgan fayllar" })
  findExpired() {
    return this.service.findExpired();
  }

  

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: "DB dan o'chirish" })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }


  

}