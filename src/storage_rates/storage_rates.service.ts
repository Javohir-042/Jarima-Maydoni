import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStorageRateDto } from "./dto/create-storage_rate.dto";
import { UpdateStorageRateDto } from "./dto/update-storage_rate.dto";
import { PrismaService } from "../Prisma/prisma.service";


@Injectable()
export class StorageRatesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateStorageRateDto) {
    const { rate_type, amount, currency, description, effective_from, effective_to } = dto;

    if (amount < 0) throw new BadRequestException("Amount manfiy bo'lishi mumkin emas");

    const fromDate = new Date(effective_from);
    const toDate = new Date(effective_to);

    if (fromDate >= toDate) {
      throw new BadRequestException("effective_from effective_to dan oldin bo'lishi kerak");
    }

    const overlappingRate = await this.prisma.storage_rates.findFirst({
      where: {
        rate_type,
        AND: [
          { effective_from: { lte: toDate } },
          { effective_to: { gte: fromDate } },
        ],
      },
    });

    if (overlappingRate) {
      throw new BadRequestException("Shu rate_type uchun vaqt oralig'i allaqachon mavjud");
    }

    return this.prisma.storage_rates.create({
      data: {
        rate_type,
        amount,
        currency,
        description,
        effective_from: fromDate,
        effective_to: toDate,
      },
    });
  }


  findAll() {
    return this.prisma.storage_rates.findMany({
      orderBy: { effective_from: "desc" }
    });
  }

  async findOne(id: number) {
    const storage_rate = await this.prisma.storage_rates.findUnique({ where: { id } })
    if (!storage_rate) {
      throw new NotFoundException("Storgae_rate id not found")
    }
    return storage_rate;
  }

  async update(id: number, updateStorageRateDto: UpdateStorageRateDto) {
    const rate = await this.prisma.storage_rates.findUnique({ where: { id } });
    if (!rate) throw new NotFoundException("Rate topilmadi");


    if (updateStorageRateDto.amount !== undefined && updateStorageRateDto.amount < 0)
      throw new BadRequestException("Amount manfiy bo'lishi mumkin emas");


    const from = updateStorageRateDto.effective_from ? new Date(updateStorageRateDto.effective_from) : rate.effective_from;
    const to = updateStorageRateDto.effective_to ? new Date(updateStorageRateDto.effective_to) : rate.effective_to;

    if (!from || !to) throw new BadRequestException("Effective_from va effective_to bo'sh bo'lishi mumkin emas");
    
    if (from >= to) throw new BadRequestException("effective_from effective_to dan oldin bo'lishi kerak");


    const overlapping = await this.prisma.storage_rates.findFirst({
      where: {
        id: { not: id },
        rate_type: updateStorageRateDto.rate_type || rate.rate_type,
        AND: [{ effective_from: { lte: to } }, { effective_to: { gte: from } }],
      },
    });
    if (overlapping) throw new BadRequestException("Vaqt oralig'i allaqachon mavjud");

    return this.prisma.storage_rates.update({
      where: { id },
      data: {
        ...updateStorageRateDto,
        effective_from: from,
        effective_to: to
      },
    });
  }


  async remove(id: number) {
    const rate = await this.prisma.storage_rates.findUnique({ where: { id } });
    if (!rate) throw new NotFoundException('Storage_reates id topilmadi');

    await this.prisma.storage_rates.delete({ where: { id } });
    return { message: "Storage_rate o'chirildi" };
  }
}
