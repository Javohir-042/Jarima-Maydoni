import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlertDto: CreateAlertDto) {
    const { location_id, ...rest } = createAlertDto;

    const location = await this.prisma.locations.findUnique({
      where: { id: location_id }
    });

    if (!location) {
      throw new ForbiddenException("Location id not found")
    }

    return this.prisma.alerts.create({
      data: {
        location_id,
        ...rest
      }
    })
  }

  findAll() {
    return this.prisma.alerts.findMany({
      include: { location: true }
    });
  }

  async findOne(id: number) {
    const alerts = await this.prisma.alerts.findUnique({
      where: { id },
      include: { location: true }
    });

    if (!alerts) {
      throw new NotFoundException("Alerts id not found")
    }

    return alerts;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const alert = await this.prisma.alerts.findUnique({ where: { id } })
    if (!alert) {
      throw new NotFoundException("Alerts id not found")
    }

    if (updateAlertDto.location_id) {
      const location = await this.prisma.locations.findUnique({
        where: { id: updateAlertDto.location_id }
      });

      if (!location) {
        throw new NotFoundException("Location_id not found")
      }
    }

    return this.prisma.alerts.update({
      where: { id },
      data: { ...updateAlertDto }
    });
  }


  async remove(id: number) {
    const alert = await this.prisma.alerts.findUnique({ where: { id } })
    if (!alert) {
      throw new NotFoundException("Alerts id not found")
    }

    await this.prisma.alerts.delete({ where: { id } });

    return { message: `Alerts o'chirildi` }
  }
}
