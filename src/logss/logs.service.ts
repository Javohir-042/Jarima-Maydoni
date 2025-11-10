import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);
  constructor(private readonly prisma: PrismaService) { }


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoRemoveOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const deleted = await this.prisma.logs.deleteMany({
      where: { created_at: { lt: cutoffDate } }
    });

    if (deleted.count > 0) {
      this.logger.warn(`Eski logs o'chirildi`);
    } else {
      this.logger.log(`Eski loglar topilmadi`);
    }
  }

  async create(createLogDto: CreateLogDto) {
    const { user_id, action, details } = createLogDto;

    const user = await this.prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException("User topilmadi")
    }

    if (user_id === 1) {
      throw new ForbiddenException("User topilmadi")
    }

    return this.prisma.logs.create({
      data: {
        user_id,
        action,
        details,
      }
    })
  }

  findAll() {
    return this.prisma.logs.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' }
    })
  }

  async findOne(id: number) {
    const log = await this.prisma.logs.findUnique({
      where: { id },
      include: { user: true }
    })
    if (!log) {
      throw new NotFoundException("Log id not found")
    }

    return log;
  }

  async findByUser(user_id: number) {
    const user = await this.prisma.users.findUnique({ where: { id: user_id } })
    if (!user) {
      throw new NotFoundException("User topilmadi")
    }

    return this.prisma.logs.findMany({
      where: { user_id },
      include: { user: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id: number, updateLogDto: UpdateLogDto) {
    const log = await this.prisma.logs.findUnique({ where: { id } });
    if (!log) throw new NotFoundException("Log topilmadi");
    
    if (updateLogDto.user_id) {
      if (updateLogDto.user_id === 1) {
        throw new ForbiddenException("User id not found")
      }

      const user = await this.prisma.users.findUnique({
        where: { id: updateLogDto.user_id }
      });

      if (!user) {
        throw new NotFoundException("User not found")
      }
    }

    return this.prisma.logs.update({
      where: { id },
      data: { ...updateLogDto }
    });
  }


  async remove(id: number) {
    const log = await this.prisma.logs.findUnique({ where: { id } });
    if (!log) throw new NotFoundException("Log topilmadi");

    await this.prisma.logs.delete({ where: { id } });
    return { message: "Log muvaffaqiyatli o'chirildi" };
  }


}
