import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImpoundRecordDto } from './dto/create-impound_record.dto';
import { UpdateImpoundRecordDto } from './dto/update-impound_record.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { Role } from '../common/enum/Role.enum';
import { ImpoundStatus } from '../common/enum/tow-truck-status.enum';

@Injectable()
export class ImpoundRecordsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createImpoundRecordDto: CreateImpoundRecordDto) {

    const nowUz = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
    let releasedAtUz: Date | null = null;

    const fine = await this.prisma.fines.findUnique({ where: { id: createImpoundRecordDto.fine_id } });
    if (!fine) throw new NotFoundException(`Fine with ID ${createImpoundRecordDto.fine_id} not found`);

    const vehicle = await this.prisma.vehicles.findUnique({ where: { id: createImpoundRecordDto.vehicle_id } });
    if (!vehicle) throw new NotFoundException(`Vehicle with ID ${createImpoundRecordDto.vehicle_id} not found`);

    if (createImpoundRecordDto.tow_truck_id) {
      const towTruck = await this.prisma.tow_trucks.findUnique({ where: { id: createImpoundRecordDto.tow_truck_id } });
      if (!towTruck) throw new NotFoundException(`Tow truck with ID ${createImpoundRecordDto.tow_truck_id} not found`);
    }

    if (createImpoundRecordDto.location_id) {
      const location = await this.prisma.locations.findUnique({ where: { id: createImpoundRecordDto.location_id } });
      if (!location) throw new NotFoundException(`Location with ID ${createImpoundRecordDto.location_id} not found`);
    }

    if (createImpoundRecordDto.storage_rate_id) {
      const rate = await this.prisma.storage_rates.findUnique({ where: { id: createImpoundRecordDto.storage_rate_id } });
      if (!rate) throw new NotFoundException(`Storage rate with ID ${createImpoundRecordDto.storage_rate_id} not found`);
    }

    if (!createImpoundRecordDto.impound_by) {
      throw new ForbiddenException('impound_by is required');
    }

    const impounder = await this.prisma.users.findUnique({
      where: { id: createImpoundRecordDto.impound_by },
    });

    if (!impounder) throw new NotFoundException(`User with ID ${createImpoundRecordDto.impound_by} not found`);

    if (impounder.role !== Role.STAFF) {
      throw new ForbiddenException(`User with role "${impounder.role}" is not allowed to impound vehicles`);
    }

    if (createImpoundRecordDto.released_by) {
      const releaser = await this.prisma.users.findUnique({
        where: { id: createImpoundRecordDto.released_by },
      });

      if (!releaser) throw new NotFoundException(`User with ID ${createImpoundRecordDto.released_by} not found`);

      if (![Role.ADMIN, Role.SUPERADMIN].includes(releaser.role as Role)) {
        throw new ForbiddenException(
          `User with role "${releaser.role}" is not allowed to release vehicles`
        );
      }

      releasedAtUz = nowUz;
    }

    const impoundedAtUz = createImpoundRecordDto.impounded_at
      ? new Date(new Date(createImpoundRecordDto.impounded_at).getTime() + 5 * 60 * 60 * 1000)
      : nowUz;

    const record = await this.prisma.impound_records.create({
      data: {
        fine_id: createImpoundRecordDto.fine_id,
        vehicle_id: createImpoundRecordDto.vehicle_id,
        tow_truck_id: createImpoundRecordDto.tow_truck_id,
        location_id: createImpoundRecordDto.location_id,
        storage_rate_id: createImpoundRecordDto.storage_rate_id,
        impound_by: createImpoundRecordDto.impound_by,
        released_by: createImpoundRecordDto.released_by || null,
        impounded_at: impoundedAtUz,
        released_at: releasedAtUz,
        status: createImpoundRecordDto.released_by ? 'RELEASED' : 'IMPOUNDED',
      }
    });

    return record
  }


  async findAll() {
    const records = await this.prisma.impound_records.findMany({
      include: {
        fine: true,
        vehicle: true,
        tow_truck: true,
        location: true,
        storage_rate: true,
        impounder: true,
        releaser: true,
        media_files: true,
      },
      orderBy: {
        impounded_at: 'desc',
      },
    });

    return records;
  }


  async findOne(id: number) {
    const record = await this.prisma.impound_records.findUnique({
      where: { id },
      include: {
        fine: true,
        vehicle: true,
        tow_truck: true,
        location: true,
        storage_rate: true,
        impounder: true,
        releaser: true,
        media_files: true,
      },
    });

    if (!record) {
      throw new NotFoundException(`Impound_record id not found`);
    }

    return record;
  }


  async update(id: number, updateImpoundRecordDto: UpdateImpoundRecordDto) {

    const nowUz = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
    let releasedAtUz: Date | null = null;

    const record = await this.prisma.impound_records.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Impound record with ID ${id} not found`);

    if (updateImpoundRecordDto.tow_truck_id) {
      const towTruck = await this.prisma.tow_trucks.findUnique({ where: { id: updateImpoundRecordDto.tow_truck_id } });
      if (!towTruck) throw new NotFoundException(`Tow truck with ID ${updateImpoundRecordDto.tow_truck_id} not found`);
    }

    if (updateImpoundRecordDto.location_id) {
      const location = await this.prisma.locations.findUnique({ where: { id: updateImpoundRecordDto.location_id } });
      if (!location) throw new NotFoundException(`Location with ID ${updateImpoundRecordDto.location_id} not found`);
    }

    if (updateImpoundRecordDto.storage_rate_id) {
      const rate = await this.prisma.storage_rates.findUnique({ where: { id: updateImpoundRecordDto.storage_rate_id } });
      if (!rate) throw new NotFoundException(`Storage rate with ID ${updateImpoundRecordDto.storage_rate_id} not found`);
    }

    if (updateImpoundRecordDto.released_by) {
      const releaser = await this.prisma.users.findUnique({ where: { id: updateImpoundRecordDto.released_by } });
      if (!releaser) throw new NotFoundException(`User with ID ${updateImpoundRecordDto.released_by} not found`);

      if (![Role.ADMIN, Role.SUPERADMIN].includes(releaser.role as Role)) {
        throw new ForbiddenException(`User with role "${releaser.role}" is not allowed to release vehicles`);
      }

      releasedAtUz = nowUz;
    }

    const impoundedAtUz = updateImpoundRecordDto.impounded_at
      ? new Date(new Date(updateImpoundRecordDto.impounded_at).getTime() + 5 * 60 * 60 * 1000)
      : record.impounded_at;


    const updatedRecord = await this.prisma.impound_records.update({
      where: { id },
      data: {
        tow_truck_id: updateImpoundRecordDto.tow_truck_id,
        location_id: updateImpoundRecordDto.location_id,
        storage_rate_id: updateImpoundRecordDto.storage_rate_id,
        impounded_at: impoundedAtUz,
        released_by: updateImpoundRecordDto.released_by,
        released_at: releasedAtUz ?? record.released_at,
        status: updateImpoundRecordDto.released_by ? ImpoundStatus.RELEASED : record.status,
      }
    });

    return updatedRecord;
  }


  async remove(id: number) {
    const impound_record = await this.prisma.impound_records.findUnique({ where: { id } });
    if (!impound_record) throw new NotFoundException('impound_records id not found');

    await this.prisma.impound_records.delete({ where: { id } });

    return { message: 'Impound_record successfully deleted' };
  }

}
