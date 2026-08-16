import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

const reqAs = (userId: number) => ({ user: { userId } }) as unknown as Request;

describe('UsersController', () => {
  let controller: UsersController;
  let service: {
    findById: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
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

  describe('findOne', () => {
    it('délègue à usersService.findById pour son propre compte', async () => {
      const user = { id: 1 };
      service.findById.mockResolvedValue(user);

      await expect(controller.findOne(1, reqAs(1))).resolves.toBe(user);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('refuse le compte d’autrui', () => {
      expect(() => controller.findOne(2, reqAs(1))).toThrow(ForbiddenException);
      expect(service.findById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('délègue à usersService.update pour son propre compte', async () => {
      const dto: UpdateUserDto = { firstName: 'Jean' };
      const updated = { id: 1, firstName: 'Jean' };
      service.update.mockResolvedValue(updated);

      await expect(controller.update(1, dto, reqAs(1))).resolves.toBe(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('refuse le compte d’autrui', () => {
      expect(() => controller.update(2, {}, reqAs(1))).toThrow(
        ForbiddenException,
      );
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('délègue à usersService.remove pour son propre compte', async () => {
      const removed = { id: 1 };
      service.remove.mockResolvedValue(removed);

      await expect(controller.remove(1, reqAs(1))).resolves.toBe(removed);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('refuse le compte d’autrui', () => {
      expect(() => controller.remove(2, reqAs(1))).toThrow(ForbiddenException);
      expect(service.remove).not.toHaveBeenCalled();
    });
  });
});
