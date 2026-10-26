import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from 'prisma/prisma.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let prisma: {
    bikeType: { findMany: jest.Mock };
    bikeBrand: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      bikeType: { findMany: jest.fn() },
      bikeBrand: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTypes', () => {
    it('renvoie id et name, triés par nom', async () => {
      const types = [{ id: 1, name: 'Route' }];
      prisma.bikeType.findMany.mockResolvedValue(types);

      const result = await service.findTypes();

      expect(prisma.bikeType.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      expect(result).toBe(types);
    });
  });

  describe('findBrands', () => {
    it('renvoie les marques avec leurs modèles, triés par nom', async () => {
      const brands = [{ id: 1, name: 'Trek', models: [] }];
      prisma.bikeBrand.findMany.mockResolvedValue(brands);

      const result = await service.findBrands();

      expect(prisma.bikeBrand.findMany).toHaveBeenCalledWith({
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
      expect(result).toBe(brands);
    });
  });
});
