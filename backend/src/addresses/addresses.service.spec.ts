import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { PrismaService } from 'prisma/prisma.service';

const publicSelect = {
  id: true,
  number: true,
  street: true,
  postalCode: true,
  locality: true,
  country: true,
};

describe('AddressesService', () => {
  let service: AddressesService;
  let prisma: {
    address: {
      findFirst: jest.Mock;
      updateMany: jest.Mock;
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      address: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  describe('findActive', () => {
    it("cherche l'adresse non supprimée du user avec les champs publics", async () => {
      const address = { id: 1 };
      prisma.address.findFirst.mockResolvedValue(address);

      await expect(service.findActive(14)).resolves.toBe(address);
      expect(prisma.address.findFirst).toHaveBeenCalledWith({
        where: { userId: 14, deletedOn: null },
        select: publicSelect,
      });
    });
  });

  describe('replace', () => {
    it("désactive l'ancienne et crée la nouvelle dans une transaction, renvoie la nouvelle", async () => {
      const dto = {
        street: 'rue des Lilas',
        postalCode: '35000',
        locality: 'Rennes',
      };
      const deactivateOp = Symbol('deactivateOp');
      const createOp = Symbol('createOp');
      const created = { id: 2 };
      prisma.address.updateMany.mockReturnValue(deactivateOp);
      prisma.address.create.mockReturnValue(createOp);
      prisma.$transaction.mockResolvedValue([{ count: 1 }, created]);

      await expect(service.replace(14, dto)).resolves.toBe(created);

      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 14, deletedOn: null },
        data: { deletedOn: expect.any(Date) },
      });
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 14 },
        select: publicSelect,
      });
      expect(prisma.$transaction).toHaveBeenCalledWith([
        deactivateOp,
        createOp,
      ]);
    });
  });
});
