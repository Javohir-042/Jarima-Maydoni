import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createStaffDto: CreateStaffDto) {

    if(createStaffDto.user_id === 1){
      throw new NotFoundException("User id not found")
    }

    const location = await this.prisma.locations.findUnique({
      where: { id: createStaffDto.location_id }
    })
    if (!location) {
      throw new NotFoundException("Location not found")
    }

    const user = await this.prisma.users.findUnique({
      where: { id: createStaffDto.user_id }
    })
    if (!user) {
      throw new NotFoundException("User not found")
    }

    const Ish_boshlanishi = new Date(Date.now() + 5 * 3600000);

    return this.prisma.staff.create({
      data: {
        location_id: createStaffDto.location_id,
        user_id: createStaffDto.user_id,
        position: createStaffDto.position,
        shift_start: Ish_boshlanishi
      },
    });
  }

  async logout(id: number) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      throw new NotFoundException("Staff id not found")
    }

    const Shift_end = new Date(Date.now() + 5 * 3600000)

    return await this.prisma.staff.update({
      where: { id },
      data: { shift_end: Shift_end },
    });
  }

  async findAll() {
    return await this.prisma.staff.findMany({
      orderBy: { shift_start: 'desc' },
      include: { 'user': true, 'location': true }
    });
  }

  async findOne(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: { 'user': true, 'location': true }
    });

    return staff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    if (!staff) throw new NotFoundException("Staff id not found")

    if (updateStaffDto.user_id && updateStaffDto.user_id === 1) {
      throw new NotFoundException("User not found")
    }

    const user = await this.prisma.users.findUnique({
      where: { id: updateStaffDto.user_id }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    if(updateStaffDto.user_id && updateStaffDto.user_id === 1){
      throw new NotFoundException("User not found")
    }

    return this.prisma.staff.update({
      where: { id },
      data: { ...updateStaffDto }
    });
  }

  async remove(id: number) {
    const staff = await this.prisma.staff.findUnique({ where: { id } })
    if (!staff) {
      throw new NotFoundException("Staff id not found");
    }

    await this.prisma.staff.delete({
      where: { id }
    });

    return { message: `Staff o'chirildi`};
  }
}
