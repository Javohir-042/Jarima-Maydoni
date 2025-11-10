import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { GetFinesFilterDto } from './dto/get-fines-filter.dto';

@Injectable()
export class FinesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFineDto: CreateFineDto) {
    const { vehicle_id, user_id, infraction_type_id, inspector_id, ...rest } = createFineDto;

    const user = await this.prisma.users.findUnique({
      where: { id: user_id }
    });
    if (!user) {
      throw new ForbiddenException("User id not found");
    }
    if (user_id === 1) {
      throw new ForbiddenException('User id not found');
    }

    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicle_id }
    });
    if (!vehicle) {
      throw new ForbiddenException("Vehicle id not found");
    }


    const infraction_type = await this.prisma.infraction_types.findUnique({
      where: { id: infraction_type_id }
    });
    if (!infraction_type) {
      throw new ForbiddenException("Infraction_type id not found");
    }


    const inspector = await this.prisma.users.findUnique({
      where: { id: inspector_id }
    });
    if (!inspector) {
      throw new ForbiddenException("Inspector id not found");
    }
    if (inspector_id === 1) {
      throw new NotFoundException("Inspector id not found")
    }


    return this.prisma.fines.create({
      data: {
        vehicle_id,
        user_id,
        infraction_type_id,
        inspector_id,
      
        ...rest
      }
    })
  }

  findAll() {
    return this.prisma.fines.findMany({
      include: { user: true, vehicle: true, infraction_type: true, inspector: true }
    });
  }

  async findOne(id: number) {
    const fine = await this.prisma.fines.findUnique({
      where: { id },
      include: { user: true, vehicle: true, infraction_type: true, inspector: true }
    });

    if (!fine) {
      throw new NotFoundException("Fines id not found");
    }

    return fine;
  }


  async update(id: number, updateFineDto: UpdateFineDto) {
    const fine = await this.prisma.fines.findUnique({ where: { id } })
    if (!fine) {
      throw new NotFoundException("Fines id not found")
    }

    if (updateFineDto.user_id) {
      if (updateFineDto.user_id === 1) {
        throw new ForbiddenException("User id not found")
      }

      const user = await this.prisma.users.findUnique({
        where: { id: updateFineDto.user_id }
      });
      if (!user) {
        throw new NotFoundException(" User not found")
      }
    }

    if (updateFineDto.vehicle_id) {
      const vehicle = await this.prisma.vehicles.findUnique({
        where: { id: updateFineDto.vehicle_id }
      });
      if (!vehicle) {
        throw new NotFoundException("Vehicle not found")
      }
    }

    if (updateFineDto.infraction_type_id) {
      const infraction_type = await this.prisma.infraction_types.findUnique({
        where: { id: updateFineDto.infraction_type_id }
      });
      if (!infraction_type) {
        throw new NotFoundException("Infraction_type not found")
      }
    }

    if (updateFineDto.inspector_id) {
      if (updateFineDto.inspector_id === 1) {
        throw new ForbiddenException("Inspector id not found")
      }

      const inspector = await this.prisma.users.findUnique({
        where: { id: updateFineDto.inspector_id }
      });
      if (!inspector) {
        throw new NotFoundException("Inspector not found")
      }
    }

    if (updateFineDto.fine_number && updateFineDto.fine_number !== fine.fine_number) {
      const exists = await this.prisma.fines.findUnique({
        where: { fine_number: updateFineDto.fine_number },
      });
      if (exists) throw new BadRequestException("fine_number already exists");
      updateFineDto.fine_number = updateFineDto.fine_number;
    }


    return this.prisma.fines.update({
      where: { id },
      data: { ...updateFineDto },
    });

  }

  async remove(id: number) {
    const fines = await this.prisma.fines.findUnique({ where: { id } });
    if (!fines) throw new NotFoundException("fines not found");

    await this.prisma.fines.delete({ where: { id } });
    return { message: `fines o'chirildi` };
  }



  async getFines(filterDto: GetFinesFilterDto) {
    const { status, minAmount, maxAmount, startDate, endDate, location } = filterDto;

    const where: any = {};


    if (status) {
      where.status = status;
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = minAmount;
      if (maxAmount) where.amount.lte = maxAmount;
    }

    if (startDate || endDate) {
      where.fine_date = {};
      if (startDate) where.fine_date.gte = new Date(startDate);
      if (endDate) where.fine_date.lte = new Date(endDate);
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const fines = await this.prisma.fines.findMany({
      where,
      orderBy: { fine_date: 'desc' },
      include: { user: true, vehicle: true, infraction_type: true, inspector: true },
    });

    return fines;
  }
}
