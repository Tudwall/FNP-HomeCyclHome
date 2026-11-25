import type { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { AddressesController } from './addresses.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { NotFoundException } from '@nestjs/common';

const user: AuthUser = { userId: 14, email: 'alice@test.com' };

describe('AddressesController', () => {
  let controller: AddressesController;
  let service: { findActive: jest.Mock; replace: jest.Mock };

  beforeEach(async () => {
    service = { findActive: jest.fn(), replace: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [{ provide: AddressesService, useValue: service }],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  describe('findMine', () => {
    it("renvoie l'adresse du user du token", async () => {
      const address = { id: 1 };
      service.findActive.mockResolvedValue(address);

      await expect(controller.findMine(user)).resolves.toBe(address);
      expect(service.findActive).toHaveBeenCalledWith(14);
    });

    it("lève NotFoundException quand le user n'a pas d'adresse", async () => {
      service.findActive.mockResolvedValue(null);

      await expect(controller.findMine(user)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('replace', () => {
    it('délègue au service avec le userId du token et renvoie son résultat', async () => {
      const dto = {
        street: 'rue des Lilas',
        postalCode: '35000',
        locality: 'Rennes',
      };
      const created = { id: 2 };
      service.replace.mockResolvedValue(created);

      await expect(controller.replace(user, dto)).resolves.toBe(created);
      expect(service.replace).toHaveBeenCalledWith(14, dto);
    });
  });
});
