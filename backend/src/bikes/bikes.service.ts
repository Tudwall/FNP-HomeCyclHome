import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

const BIKE_DETAILS = {
  bikeType: true,
  bikeModel: { include: { bikeBrand: true } },
};

@Injectable()
export class BikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createBikeDto: CreateBikeDto) {
    return this.prisma.bike.create({
      data: { ...createBikeDto, userId },
      include: BIKE_DETAILS,
    });
  }

  findAll(userId: number) {
    return this.prisma.bike.findMany({
      where: { userId, deletedOn: null },
      include: BIKE_DETAILS,
      orderBy: { createdOn: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const bike = await this.prisma.bike.findUnique({
      where: { id, userId, deletedOn: null },
      include: BIKE_DETAILS,
    });
    if (!bike) {
      throw new NotFoundException(`Vélo ${id} introuvable`);
    }
    return bike;
  }

  update(userId: number, id: number, updateBikeDto: UpdateBikeDto) {
    return this.prisma.bike.update({
      where: { id, userId, deletedOn: null },
      data: updateBikeDto,
      include: BIKE_DETAILS,
    });
  }

  remove(userId: number, id: number) {
    return this.prisma.bike.update({
      where: { id, userId, deletedOn: null },
      data: { deletedOn: new Date() },
    });
  }
}
