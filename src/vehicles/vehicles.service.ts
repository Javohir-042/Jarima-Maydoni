import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createVehicleDto: CreateVehicleDto) {
    const exists = await this.prisma.vehicles.findUnique({
      where: { plate_number: createVehicleDto.plate_number },
    });

    if (exists) {
      throw new BadRequestException("Vehicles plate_number already exists")
    }

    if (createVehicleDto.user_id === 1) {
      throw new ForbiddenException('User id not found');
    }

    const vin = await this.prisma.vehicles.findUnique({
      where: { vin: createVehicleDto.vin },
    })
    if (vin) {
      throw new BadRequestException("Vin already exists")
    }

    const user = await this.prisma.users.findUnique({
      where: { id: createVehicleDto.user_id }
    });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if(createVehicleDto.user_id === 1){
      throw new BadRequestException("User not found")
    }


    return this.prisma.vehicles.create({ data: { ...createVehicleDto } })
  }

  findAll() {
    return this.prisma.vehicles.findMany({ include: { 'user': true } })
  }

  async findOne(id: number) {
    const vehicles = await this.prisma.vehicles.findUnique({ where: { id }, include: { 'user': true } });
    if (!vehicles) {
      throw new NotFoundException("Vehicles id not found")
    }
    return vehicles;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const vehicles = await this.prisma.vehicles.findUnique({ where: { id } })  
    if (!vehicles) {
      throw new NotFoundException("Vehicles id not found")
    }

    if (updateVehicleDto.user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: updateVehicleDto.user_id }
      });
      if (!user) throw new BadRequestException("User not found");
    }


    if (updateVehicleDto.plate_number) {
      const existsPlate_number = await this.prisma.vehicles.findUnique({
        where: { plate_number: updateVehicleDto.plate_number },
      });
      if (existsPlate_number && existsPlate_number.id !== id) {
        throw new BadRequestException("Plate_number already exists")
      }
    }

    if (updateVehicleDto.vin) {
      const existsVin = await this.prisma.vehicles.findUnique({
        where: { vin: updateVehicleDto.vin }
      });
      if (existsVin && existsVin.id !== id) {
        throw new BadRequestException("Vin already exists")
      }
    }

    if (updateVehicleDto.user_id === 1) {
      throw new ForbiddenException('User id not found');
    }

    return this.prisma.vehicles.update({
      where: { id },
      data: { ...updateVehicleDto }
    });
  }

  async remove(id: number) {
    const vehicle = await this.prisma.vehicles.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicles id not found');

    await this.prisma.vehicles.delete({ where: { id } });

    return { message: 'Vehicle successfully deleted' };
  }

}
