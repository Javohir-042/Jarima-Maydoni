import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createReportDto: CreateReportDto) {
    const { generated_by, ...rest } = createReportDto;

    const user = await this.prisma.users.findUnique({
      where: { id: generated_by }
    });

    if (!user) {
      throw new ForbiddenException("User id not found");
    }

    if (generated_by === 1) {
      throw new ForbiddenException('User id not allowed');
    }

    return await this.prisma.reports.create({
      data: {
        generated_by,
        ...rest
      }
    });
  }

  findAll() {
    return this.prisma.reports.findMany({
      include: { user: true }
    });
  }

  async findOne(id: number) {
    const report = await this.prisma.reports.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!report) {
      throw new NotFoundException(`Report id ${id} not found`);
    }

    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.prisma.reports.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException("Report id not found");
    }

    if (updateReportDto.generated_by) {
      if (updateReportDto.generated_by === 1) {
        throw new ForbiddenException('User id not found');
      }

      const user = await this.prisma.users.findUnique({
        where: { id: updateReportDto.generated_by }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }
    }

    return this.prisma.reports.update({
      where: { id },
      data: { ...updateReportDto },
    });
  }

  async remove(id: number) {
    const report = await this.prisma.reports.findUnique({ where: { id } });
    if (!report) throw new NotFoundException(`Report id ${id} not found`);

    await this.prisma.reports.delete({ where: { id } });

    return { message: "Report o'chirildi" };
  }
}
