import { Test, TestingModule } from '@nestjs/testing';
import { BikesService } from './bikes.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBikeDto } from './dto/create-bike.dto';

const BIKE_DETAILS = {
  bikeType: true,
  bikeModel: { include: { bikeBrand: true } },
};

const BIKE_HIDDEN = {
  userId: true,
  deletedOn: true,
};

describe('BikesService', () => {
  let service: BikesService;
  let prisma: {
    bike: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      bike: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BikesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<BikesService>(BikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('rattache le vélo au user courant et inclut les détails', async () => {
      const dto: CreateBikeDto = { bikeModelId: 3, typeId: 2 };
      const created = { id: 1, ...dto, userId: 14 };
      prisma.bike.create.mockResolvedValue(created);

      const result = await service.create(14, dto);

      expect(prisma.bike.create).toHaveBeenCalledWith({
        data: { bikeModelId: 3, typeId: 2, userId: 14 },
        include: BIKE_DETAILS,
        omit: BIKE_HIDDEN,
      });
      expect(result).toBe(created);
    });
  });

  describe('findAll', () => {
    it('ne renvoie que les vélos non supprimés du user, plus récents d’abord', async () => {
      const bikes = [{ id: 2 }, { id: 1 }];
      prisma.bike.findMany.mockResolvedValue(bikes);

      const result = await service.findAll(14);

      expect(prisma.bike.findMany).toHaveBeenCalledWith({
        where: { userId: 14, deletedOn: null },
        include: BIKE_DETAILS,
        omit: BIKE_HIDDEN,
        orderBy: { createdOn: 'desc' },
      });
      expect(result).toBe(bikes);
    });
  });

  describe('findOne', () => {
    it('cherche par id ET userId en excluant les supprimés', async () => {
      const bike = { id: 1 };
      prisma.bike.findUniqueOrThrow.mockResolvedValue(bike);

      const result = await service.findOne(14, 1);

      expect(prisma.bike.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1, userId: 14, deletedOn: null },
        include: BIKE_DETAILS,
        omit: BIKE_HIDDEN,
      });
      expect(result).toBe(bike);
    });

    it('propage l’erreur de Prisma quand rien ne correspond', async () => {
      const notFound = new Error('P2025');
      prisma.bike.findUniqueOrThrow.mockRejectedValue(notFound);

      await expect(service.findOne(14, 999)).rejects.toBe(notFound);
    });
  });

  describe('update', () => {
    it('met à jour uniquement un vélo du user non supprimé', async () => {
      const dto = { typeId: 4 };
      const updated = { id: 1, typeId: 4 };
      prisma.bike.update.mockResolvedValue(updated);

      const result = await service.update(14, 1, dto);

      expect(prisma.bike.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 14, deletedOn: null },
        data: dto,
        include: BIKE_DETAILS,
        omit: BIKE_HIDDEN,
      });
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('fait un soft-delete et ne renvoie rien', async () => {
      prisma.bike.update.mockResolvedValue({ id: 1 });

      const result = await service.remove(14, 1);

      expect(prisma.bike.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 14, deletedOn: null },
        data: { deletedOn: expect.any(Date) },
      });
      expect(result).toBeUndefined();
    });
  });
});
