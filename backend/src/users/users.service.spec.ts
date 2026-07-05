import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { first } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    appUser: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      appUser: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('appelle prisma.appUser.create avec {data} et renvoie le user créé', async () => {
      const dto: CreateUserDto = {
        email: 'a@b.com',
        password: 'hashed',
        firstName: 'Jean',
        lastName: 'Dupont',
      };
      const created = { id: 1, ...dto };
      prisma.appUser.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(prisma.appUser.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toBe(created);
    });
  });

  describe('findAll', () => {
    it('renvoie les users non supprimés (deletedOn:null)', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      prisma.appUser.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(prisma.appUser.findMany).toHaveBeenCalledWith({
        where: { deletedOn: null },
      });
      expect(result).toBe(users);
    });
  });

  describe('findById', () => {
    it('cherche par id en excluant les supprimés et renvoie le user', async () => {
      const user = { id: 1 };
      prisma.appUser.findUnique.mockResolvedValue(user);

      const result = await service.findById(1);

      expect(prisma.appUser.findUnique).toHaveBeenCalledWith({
        where: { id: 1, deletedOn: null },
      });
      expect(result).toBe(user);
    });

    it('renvoie null quand aucun user ne correspond', async () => {
      prisma.appUser.findUnique.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('cherche par email', async () => {
      const user = { id: 1, email: 'test@test.com' };
      prisma.appUser.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');

      expect(prisma.appUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('met à jour le user ciblé avec le dto', async () => {
      const dto = { firstName: 'Jean' };
      const updated = { id: 1, firstName: 'Jean' };
      prisma.appUser.update.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(prisma.appUser.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('fait un soft-delete en posant deletedOn à une date', async () => {
      prisma.appUser.update.mockResolvedValue({ id: 1 });

      await service.remove(1);

      expect(prisma.appUser.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedOn: expect.any(Date) },
      });
    });
  });
});
