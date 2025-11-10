import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AccessTokenGuard, RolesGuard } from '../common/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enum/Role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }


  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Get(':recordId')
  calculate(@Param('recordId', ParseIntPipe) recordId: number) {
    return this.paymentsService.calculatePayment(recordId);
  }

  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return await this.paymentsService.createPayment(
      dto.recordId,
      dto.userId,
      dto.paymentMethod,
    );
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Roles(Role.USER, Role.STAFF, Role.ADMIN, Role.SUPERADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

}
