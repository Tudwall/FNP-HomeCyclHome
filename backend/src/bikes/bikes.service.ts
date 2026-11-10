import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import type { Prisma } from 'src/generated/prisma/client';

const BIKE_DETAILS = {
  bikeType: true,
  bikeModel: { include: { bikeBrand: true } },
} as const satisfies Prisma.BikeInclude;

const BIKE_HIDDEN = {
  userId: true,
  deletedOn: true,
} as const satisfies Prisma.BikeOmit;

@Injectable()
export class BikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createBikeDto: CreateBikeDto) {
    return this.prisma.bike.create({
      data: { ...createBikeDto, userId },
      include: BIKE_DETAILS,
      omit: BIKE_HIDDEN,
    });
  }

  findAll(userId: number) {
    return this.prisma.bike.findMany({
      where: { userId, deletedOn: null },
      include: BIKE_DETAILS,
      omit: BIKE_HIDDEN,
      orderBy: { createdOn: 'desc' },
    });
  }

  findOne(userId: number, id: number) {
    return this.prisma.bike.findUniqueOrThrow({
      where: { id, userId, deletedOn: null },
      include: BIKE_DETAILS,
      omit: BIKE_HIDDEN,
    });
  }

  update(userId: number, id: number, updateBikeDto: UpdateBikeDto) {
    return this.prisma.bike.update({
      where: { id, userId, deletedOn: null },
      data: updateBikeDto,
      include: BIKE_DETAILS,
      omit: BIKE_HIDDEN,
    });
  }

  async remove(userId: number, id: number): Promise<void> {
    await this.prisma.bike.update({
      where: { id, userId, deletedOn: null },
      data: { deletedOn: new Date() },
    });
  }
}
