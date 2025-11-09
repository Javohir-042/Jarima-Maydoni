import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }

  async calculatePayment(recordId: number, now: Date = new Date()) {
    const record = await this.prisma.impound_records.findUnique({
      where: { id: recordId },
    });
    if (!record) throw new NotFoundException('Impound record not found');
    const fine = await this.prisma.fines.findUnique({
      where: { id: record.fine_id },
    });
    if (!fine) throw new NotFoundException('Fine not found');
    const fineAmount = fine.amount;
    const impoundDate = new Date(record.impounded_at);
    const daysStayed = Math.ceil(
      Math.abs(now.getTime() - impoundDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const dailyRate = 0.25 * fineAmount; 
    const totalAmount = fineAmount + dailyRate * daysStayed;
    return { recordId, fineAmount, daysStayed, totalAmount };
  }

  async createPayment(recordId: number, userId: number, paymentMethod: string) {
    const record = await this.prisma.impound_records.findUnique({
      where: { id: recordId },
    });
    if (!record) throw new NotFoundException('Impound record not found');


    const existingPayment = await this.prisma.payments.findFirst({
      where: { fine_id: record.fine_id },
    });
    if (existingPayment) {
      throw new ConflictException('Sizning jarmimangiz tolangan ');
    }

    const paymentData = await this.calculatePayment(recordId);


    try {
      const created = await this.prisma.$transaction(async (tx) => {

        const payment = await tx.payments.create({
          data: {
            fine_id: record.fine_id,
            record_id: `REC-${record.id}-${Date.now()}`, 
            paid_by: userId,
            amount: paymentData.totalAmount,
            payment_method: paymentMethod,
          },
        });


        await tx.fines.update({
          where: { id: record.fine_id },
          data: {
            status: 'PAID', 
            paid_amount: paymentData.totalAmount,
          },
        });

       
        await tx.impound_records.update({
          where: { id: recordId },
          data: {
            status: 'RELEASED',
            released_at: new Date(),
          },
        });

        return payment;
      });
      return created;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Payment already created by another process.');
      }
      throw new InternalServerErrorException('Unable to create payment.');
    }
  }

  async findAll() {
    return this.prisma.payments.findMany({ include: { fine: true, user: true } }); 
  }

  async findOne(id: number) {
    const payment = await this.prisma.payments.findUnique({ where: { id }, include: { fine: true, user: true } });
    if (!payment) throw new NotFoundException('Payment id not found');
    return payment;
  }
}