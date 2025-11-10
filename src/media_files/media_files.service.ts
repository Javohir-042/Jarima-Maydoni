import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateMediaFileDto } from './dto/create-media_file.dto';
import path from 'path';
import fs from 'fs'

@Injectable()
export class MediaFilesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateMediaFileDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmagan');
    }

    const user = await this.prisma.users.findUnique({
      where: { id: dto.uploaded_by },
    });
    if (!user) {
      throw new NotFoundException(`Foydalanuvchi (ID: ${dto.uploaded_by}) topilmadi`);
    }

    if (dto.fine_id) {
      const fine = await this.prisma.fines.findUnique({
        where: { id: dto.fine_id },
      });
      if (!fine) {
        throw new NotFoundException(`Fine (ID: ${dto.fine_id}) topilmadi`);
      }
    }

    if (dto.record_id) {
      const record = await this.prisma.impound_records.findUnique({
        where: { id: dto.record_id },
      });
      if (!record) {
        throw new NotFoundException(`Record (ID: ${dto.record_id}) topilmadi`);
      }
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const filePath = path.join(uploadsDir, file.originalname);
    await fs.promises.writeFile(filePath, file.buffer);

    const createdFile = await this.prisma.media_files.create({
      data: {
        file_path: filePath,
        file_type: file.mimetype,
        uploaded_by: dto.uploaded_by,
        fine_id: dto.fine_id || null,
        record_id: dto.record_id || null,
        effective_to: dto.effective_to ? new Date(dto.effective_to) : null,
      },
    });

    return {
      message: 'Fayl muvaffaqiyatli yuklandi ',
      file: createdFile,
    };
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
