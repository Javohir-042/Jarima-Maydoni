import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateMediaFileDto } from './dto/create-media_file.dto';

@Injectable()
export class MediaFilesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDto: CreateMediaFileDto) {
    if (!createDto.fine_id && !createDto.record_id) {
      throw new BadRequestException('fine_id yoki record_id kiritilishi shart');
    }

    return this.prisma.media_files.create({
      data: {
        fine_id: createDto.fine_id,
        record_id: createDto.record_id,
        file_path: createDto.file_path,
        file_type: createDto.file_type,
        uploaded_by: createDto.uploaded_by,
        effective_to: createDto.effective_to ? new Date(createDto.effective_to) : null,
      },
      include: {
        fine: true,
        record: true,
        uploader: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
  }


  async findOne(id: number) {
    const file = await this.prisma.media_files.findUnique({
      where: { id },
      include: {
        fine: true,
        record: true,
        uploader: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException(`ID ${id} bo'lgan fayl topilmadi`);
    }

    return file;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.media_files.delete({ where: { id } });
  }

  async findExpired() {
    return this.prisma.media_files.findMany({
      where: {
        effective_to: { lt: new Date() },
      },
      include: {
        fine: true,
        record: true,
        uploader: {
          select: { id: true, full_name: true, email: true },
        },
      },
      orderBy: { effective_to: 'asc' },
    });
  }


}
