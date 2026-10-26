import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  findTypes() {
    return this.prisma.bikeType.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  findBrands() {
    return this.prisma.bikeBrand.findMany({
      select: {
        id: true,
        name: true,
        models: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
