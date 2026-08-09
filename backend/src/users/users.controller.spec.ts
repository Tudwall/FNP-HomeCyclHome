import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: {
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('délègue à usersService.findAll', async () => {
      const users = [{ id: 1 }];
      service.findAll.mockResolvedValue(users);

      await expect(controller.findAll()).resolves.toBe(users);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('délègue à usersService.findById avec id', async () => {
      const user = { id: 1 };
      service.findById.mockResolvedValue(user);

      await expect(controller.findOne(1)).resolves.toBe(user);
    });
  });

  describe('update', () => {
    it('délègue à usersService.update avec id + dto', async () => {
      const dto: UpdateUserDto = { firstName: 'Jean' };
      const updated = { id: 1, firstName: 'Jean' };
      service.update.mockResolvedValue(updated);

      await expect(controller.update(1, dto)).resolves.toBe(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('délègue à usersService.remove avec id', async () => {
      const removed = { id: 1 };
      service.remove.mockResolvedValue(removed);

      await expect(controller.remove(1)).resolves.toBe(removed);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
