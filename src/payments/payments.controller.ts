import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }


  @Get(':recordId')
  calculate(@Param('recordId', ParseIntPipe) recordId: number) {
    return this.paymentsService.calculatePayment(recordId);
  }

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return await this.paymentsService.createPayment(
      dto.recordId,
      dto.userId,
      dto.paymentMethod,
    );
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  // Bitta to'lovni ID bo'yicha olish
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

}
