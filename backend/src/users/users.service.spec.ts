import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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
});
