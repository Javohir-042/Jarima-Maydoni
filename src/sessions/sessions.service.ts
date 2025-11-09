import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { user_id: number; device_info: string; ip_address: string }) {

    const user = await this.prisma.users.findUnique({
      where: { id: data.user_id }
    })

    if (data.user_id === 1) {
      throw new ForbiddenException('User id not found');
    }

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const loginTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
    return await this.prisma.sessions.create({
      data: {
        user_id: data.user_id,
        device_info: data.device_info,
        ip_address: data.ip_address,
        login_time: loginTime,
      },
    });
  }


  async logout(id: number) {
    const session = await this.prisma.sessions.findUnique({ where: { id } });
    if (!session) throw new NotFoundException(`Session with ID ${id} not found`);

    const loginTime = new Date(Date.now() + 5 * 60 * 60 * 1000);

    return await this.prisma.sessions.update({
      where: { id },
      data: { logout_time: loginTime },
    });
  }


  async findAll() {
    return await this.prisma.sessions.findMany({
      orderBy: { login_time: 'desc' },
      include: { 'user': true }
    });
  }


  async findOne(id: number) {
    const session = await this.prisma.sessions.findUnique({
      where: { id },
      include: { 'user': true }
    });
    if (!session) throw new NotFoundException(`Session with ID ${id} not found`);
    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.prisma.sessions.findUnique({ where: { id } });
    if (!session) throw new NotFoundException(`Session with ID ${id} not found`);

    if (updateSessionDto.user_id && updateSessionDto.user_id === 1) {
      throw new ForbiddenException("User not found")
    }

    const user = await this.prisma.users.findUnique({
      where: { id: updateSessionDto.user_id }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.sessions.update({
      where: { id },
      data: { ...updateSessionDto },
    });
  }



  async remove(id: number) {
    const seession = await this.prisma.sessions.findUnique({ where: { id } });
    if (!seession) throw new NotFoundException(`Session id not found`);

    await this.prisma.sessions.delete({
      where: { id },
    });

    return { message: "seession o'chirildi" };
  }
}
