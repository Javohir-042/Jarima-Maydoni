import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaFilesService } from './media_files.service';
import { CreateMediaFileDto } from './dto/create-media_file.dto';
import { UpdateMediaFileDto } from './dto/update-media_file.dto';

@ApiTags('Media Files')
@Controller('media-files')
export class MediaFilesController {
  constructor(private readonly service: MediaFilesService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Fayl yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        fine_id: { type: 'number' },
        record_id: { type: 'number' },
        effective_to: { type: 'string', format: 'date' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/media-files',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Fayl turi ruxsat etilmagan'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() dto: UpdateMediaFileDto) {
    if (!file) throw new BadRequestException('Fayl yuklanmadi');

    const createDto: CreateMediaFileDto = {
      file_path: `uploads/media-files/${file.filename}`,
      file_type: file.mimetype,
      uploaded_by: 1, // Keyin req.user.id dan olasiz
      fine_id: dto.fine_id,
      record_id: dto.record_id,
      effective_to: dto.effective_to,
    };

    return this.service.create(createDto);
  }

  @Get('expired')
  @ApiOperation({ summary: 'Muddati o\'tgan fayllar' })
  findExpired() {
    return this.service.findExpired();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'DB dan o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }


}