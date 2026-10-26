import { Test, TestingModule } from '@nestjs/testing';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';
import type { AuthUser } from 'src/auth/decorators/current-user.decorator';

const user: AuthUser = { userId: 14, email: 'alice@test.com' };

describe('BikesController', () => {
  let controller: BikesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikesController],
      providers: [{ provide: BikesService, useValue: service }],
    }).compile();

    controller = module.get<BikesController>(BikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create délègue avec le userId du token', async () => {
    const dto = { bikeModelId: 3, typeId: 2 };
    const created = { id: 1 };
    service.create.mockResolvedValue(created);

    await expect(controller.create(user, dto)).resolves.toBe(created);
    expect(service.create).toHaveBeenCalledWith(14, dto);
  });

  it('findAll délègue avec le userId du token', async () => {
    const bikes = [{ id: 1 }];
    service.findAll.mockResolvedValue(bikes);

    await expect(controller.findAll(user)).resolves.toBe(bikes);
    expect(service.findAll).toHaveBeenCalledWith(14);
  });

  it('findOne délègue avec userId et id', async () => {
    const bike = { id: 1 };
    service.findOne.mockResolvedValue(bike);

    await expect(controller.findOne(user, 1)).resolves.toBe(bike);
    expect(service.findOne).toHaveBeenCalledWith(14, 1);
  });

  it('update délègue avec userId, id et dto', async () => {
    const dto = { typeId: 4 };
    const updated = { id: 1, typeId: 4 };
    service.update.mockResolvedValue(updated);

    await expect(controller.update(user, 1, dto)).resolves.toBe(updated);
    expect(service.update).toHaveBeenCalledWith(14, 1, dto);
  });

  it('remove délègue avec userId et id', async () => {
    service.remove.mockResolvedValue(undefined);

    await expect(controller.remove(user, 1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(14, 1);
  });
});
