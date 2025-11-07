import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInfractionTypeDto } from './dto/create-infraction_type.dto';
import { UpdateInfractionTypeDto } from './dto/update-infraction_type.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class InfractionTypesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createInfractionTypeDto: CreateInfractionTypeDto) {
    const { code, ...rest } = createInfractionTypeDto;

    const existsCode = await this.prisma.infraction_types.findUnique({
      where: { code },
    });

    if (existsCode) {
      throw new BadRequestException('Code already exists');
    }

    const newInfractionType = await this.prisma.infraction_types.create({
      data: {
        code,
        ...rest,
        created_at: new Date(new Date().getTime() + 5 * 3600000),
      },
    });

    return newInfractionType;
  }

  findAll() {
    return this.prisma.infraction_types.findMany()
  }

  async findOne(id: number) {
    const infraction_type = await this.prisma.infraction_types.findUnique({ where: { id } })

    if (!infraction_type) {
      throw new NotFoundException("Infraction_type id not found")
    }
    return infraction_type;
  }

  async update(id: number, updateInfractionTypeDto: UpdateInfractionTypeDto) {
    const infraction_type = await this.prisma.infraction_types.findUnique({ where: { id } })
    if (!infraction_type) {
      throw new NotFoundException("Infraction_type id not found")
    }

    if (updateInfractionTypeDto.code && updateInfractionTypeDto.code !== infraction_type.code) {
      throw new BadRequestException("Code ni ozgaritirib bolmaydi")
    }

    if (updateInfractionTypeDto.code) {
      const existsCode = await this.prisma.infraction_types.findUnique({
        where: { code: updateInfractionTypeDto.code },
      });
      if (existsCode && existsCode.id !== id) {
        throw new BadRequestException("Code already exists")
      }
    }

    return this.prisma.infraction_types.update({
      where: { id },
      data: { ...updateInfractionTypeDto }
    });
  }

  async remove(id: number) {
    const infraction_type = await this.prisma.infraction_types.findUnique({ where: { id } })
    if (!infraction_type) {
      throw new NotFoundException(" Infraction_type id not found")
    }
    return { message: `Infraction_type o'chirildi` }
  }
}
