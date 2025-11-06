import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guard';
import { GetCurrentUserId, Public } from '../common/decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/Role.enum';
import { RolesGuard } from '../common/guard/roles.guard';

@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SUPERADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.SUPERADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Roles(Role.SUPERADMIN)
  @Get(':id')
  findOne(
    @GetCurrentUserId() currentUserId: number, 
    @Param('id') id: string
  ) {
    return this.usersService.findOne(currentUserId, +id);
  }


  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles( Role.SUPERADMIN )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
