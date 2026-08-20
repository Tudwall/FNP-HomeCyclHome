import { Injectable } from '@nestjs/common';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { bike } from 'src/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CyclesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCycleDto: CreateCycleDto): Promise<bike> {
    return this.prisma.bike.create({ data: createCycleDto });
  }

  findAll() {
    return this.prisma.bike.findMany({ where: { deletedOn: null } });
  }

  findOne(id: number) {
    return this.prisma.bike.findUnique({
      where: { id, deletedOn: null },
    });
  }

  findAllByUser(userId: number) {
    return this.prisma.bike.findMany({
      where: { appUser: userId, deletedOn: null },
    });
  }

  update(id: number, updateCycleDto: UpdateCycleDto) {
    return this.prisma.bike.update({
      where: { id, deletedOn: null },
      data: updateCycleDto,
    });
  }

  remove(id: number) {
    return this.prisma.bike.update({
      where: { id, deletedOn: null },
      data: { deletedOn: new Date() },
    });
  }
}
