import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLocationDto: CreateLocationDto) {
    const newLocation = await this.prisma.locations.create({
      data: {
        ...createLocationDto,
        created_at: new Date(new Date().getTime() + 5 * 3600 * 1000)
      }
    });

    return newLocation;
  }

  findAll() {
    return this.prisma.locations.findMany();
  }

  async findOne(id: number) {
    const location = await this.prisma.locations.findUnique({
      where: { id }
    });

    if (!location) {
      throw new NotFoundException(`Location id ${id} not found`);
    }

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException("Location id not found");
    }


    return this.prisma.locations.update({
      where: { id },
      data: { ...updateLocationDto },
    });
  }

  async remove(id: number) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location) throw new NotFoundException(`Location id ${id} not found`);

    await this.prisma.locations.delete({ where: { id } });

    return { message: "Location o'chirildi" };
  }
}
