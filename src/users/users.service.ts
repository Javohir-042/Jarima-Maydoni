import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../Prisma/prisma.service';
import bcrypt from 'bcrypt';
import { Role } from '../common/enum/Role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = process.env.SUPER_ADMIN_NAME || 'Javohir';

    if (!email || !password) return;

    const existSuperAdmin = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!existSuperAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.users.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          full_name: name,
          role: Role.SUPERADMIN,
          phone_number: process.env.SUPER_ADMIN_PHONE || '998000000000',
        },
      });


      console.log('Superadmin yaratildi');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existsUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (createUserDto.role === Role.SUPERADMIN) {
      const existsSuperAdmin = await this.prisma.users.findFirst({
        where: { role: Role.SUPERADMIN },
      });
      if (existsSuperAdmin) {
        throw new BadRequestException('');
      }
    }

    if (existsUser) {
      throw new BadRequestException('User email already exists');
    }

    const password = createUserDto.password || createUserDto.password;
    if (!password) {
      throw new BadRequestException("Parol kiritilmagan");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    return this.prisma.users.create({
      data: {
        full_name: createUserDto.full_name,
        email: createUserDto.email,
        phone_number: createUserDto.phone_number,
        password: hashedPassword,  
        role: createUserDto.role || Role.USER,
        is_active: true,
      },
    });

  }


  findAll() {
    return this.prisma.users.findMany({
      where: { role: { not: Role.SUPERADMIN },  }
    });
  }

  async findOne(currentUserId: number, targetUserId: number) {
    const currentUser = await this.prisma.users.findUnique({ where: { id: currentUserId } });
    if (!currentUser) {
      throw new ForbiddenException('Ruxsat berilmadi');
    }

    const targetUser = await this.prisma.users.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.role === Role.SUPERADMIN) {
      throw new ForbiddenException('User not found');
    }

    if (currentUser.id === targetUserId) {
      return targetUser;
    }

    if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPERADMIN) {
      return targetUser;
    }

    throw new ForbiddenException('Ruxsat berilmadi');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      throw new BadRequestException("Email cannot be changed");
    }

    if (user.role === Role.SUPERADMIN) {
      throw new BadRequestException("");
    }

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 7);
    }

    return this.prisma.users.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword, 
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    if (user.role === Role.SUPERADMIN) {
      throw new BadRequestException("");
    }

    await this.prisma.users.delete({ where: { id } });
    return { message: `User o'chirildi` };
  }
}
