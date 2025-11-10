import { Controller, Post, Body, Req, Patch, Param, Get, Delete, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import type { Request } from 'express';
import { getClientIp } from '../common/utils/get-client-ip';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Sessions  => Kim tizimga kirganini kuzatish ')
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateSessionDto) {
    const ip = getClientIp(req);
    return this.sessionsService.create({
      user_id: dto.user_id,
      device_info: dto.device_info,
      ip_address: ip,
    });
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id/logout')
  async logout(@Param('id') id: string) {
    return this.sessionsService.logout(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  async findAll() {
    return this.sessionsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto
  ) {
    return this.sessionsService.update(+id, dto);
  }


  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }

}

