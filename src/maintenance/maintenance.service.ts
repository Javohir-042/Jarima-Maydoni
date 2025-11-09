import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const { tow_truck_id, performed_by, ...rest } = createMaintenanceDto

    const tow_truck = await this.prisma.tow_trucks.findUnique({
      where: { id: tow_truck_id }
    });
    if (!tow_truck) {
      throw new ForbiddenException("Tow_truck id not found")
    }

    const user = await this.prisma.users.findUnique({
      where: { id: performed_by }
    });
    if (!user) {
      throw new ForbiddenException("User id not found")
    }

    if (performed_by === 1) {
      throw new ForbiddenException("User id not found")
    }

    return this.prisma.maintenance.create({
      data: {
        tow_truck_id,
        performed_by,
        ...rest
      }
    })
  }

  findAll() {
    return this.prisma.maintenance.findMany({
      include: { user: true, tow_truck: true }
    })
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: { user: true, tow_truck: true }
    });

    if (!maintenance) {
      throw new NotFoundException("Maintenance id not found")
    }

    return maintenance;
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.findUnique({ where: { id } })
    if (!maintenance) {
      throw new NotFoundException("Maintenance id not found")
    }

    if (updateMaintenanceDto.performed_by) {
      if (updateMaintenanceDto.performed_by === 1) {
        throw new ForbiddenException("User id not found")
      }

      const user = await this.prisma.users.findUnique({
        where: { id: updateMaintenanceDto.performed_by }
      });

      if (!user) {
        throw new NotFoundException("User not found")
      }
    }

    if (updateMaintenanceDto.tow_truck_id) {

      const tow_truck = await this.prisma.maintenance.findUnique({ where: { id } })

      if (!tow_truck) {
        throw new NotFoundException("Tow_truck id not found")
      }
    }

    return this.prisma.maintenance.update({
      where: { id },
      data: { ...updateMaintenanceDto }
    });
  }

  async remove(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({ where: { id } })
    if (!maintenance) {
      throw new NotFoundException("Maintenance id not found")
    }

    await this.prisma.maintenance.delete({ where: { id } })

    return { message: "Maintenance o'chirildi" }
  }
}
