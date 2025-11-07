import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TowTruckStatus } from '../common/enum/tow-truck-status.enum';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateTowTruckDto } from './dto/create-tow_truck.dto';
import { UpdateTowTruckDto } from './dto/update-tow_truck.dto';

@Injectable()
export class TowTrucksService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createDto: CreateTowTruckDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {

      const existing = await tx.tow_trucks.findUnique({
        where: { reg_number: createDto.reg_number },
      });
      if (existing) throw new BadRequestException('Reg number already exists');


      const towTruck = await tx.tow_trucks.create({
        data: {
          ...createDto,
          status: createDto.status || TowTruckStatus.AVAILABLE,
        },
      });

      // 3. Log yozish
      await tx.logs.create({
        data: {
          user_id: userId,
          action: 'TOW_TRUCK_CREATED',
          details: JSON.stringify({
            tow_truck_id: towTruck.id,
            reg_number: towTruck.reg_number,
          }),
        },
      });

      return towTruck;
    });
  }


  async findAll() {
    return this.prisma.tow_trucks.findMany();
  }


  async findOne(id: number) {
    const towTruck = await this.prisma.tow_trucks.findUnique({ where: { id } });
    if (!towTruck) throw new NotFoundException('Tow truck not found');
    return towTruck;
  }


  async update(id: number, updateDto: UpdateTowTruckDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.tow_trucks.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Tow truck not found');


      if (updateDto.reg_number) {
        const duplicate = await tx.tow_trucks.findUnique({ where: { reg_number: updateDto.reg_number } });
        if (duplicate && duplicate.id !== id) throw new BadRequestException('Reg number already exists');
      }

      const updated = await tx.tow_trucks.update({
        where: { id },
        data: updateDto,
      });

      await tx.logs.create({
        data: {
          user_id: userId,
          action: 'TOW_TRUCK_UPDATED',
          details: JSON.stringify({ tow_truck_id: id }),
        },
      });

      return updated;
    });
  }


  async remove(id: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const towTruck = await tx.tow_trucks.findUnique({ where: { id } });
      if (!towTruck) throw new NotFoundException('Tow truck not found');

      await tx.logs.create({
        data: {
          user_id: userId,
          action: 'TOW_TRUCK_DELETED',
          details: JSON.stringify({ tow_truck_id: id, reg_number: towTruck.reg_number }),
        },
      });

      await tx.tow_trucks.delete({ where: { id } });
      return { message: 'Deleted successfully' };
    });
  }
}
