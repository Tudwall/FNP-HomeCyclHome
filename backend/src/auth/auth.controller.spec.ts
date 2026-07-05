import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signup: jest.Mock; login: jest.Mock };
  let res: { cookie: jest.Mock; clearCookie: jest.Mock };

  beforeEach(async () => {
    authService = { signup: jest.fn(), login: jest.fn() };
    res = { cookie: jest.fn(), clearCookie: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('délègue à authService.signup', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'plaintext',
        firstName: 'Jean',
        lastName: 'Dupont',
      };
      const created = { id: 1, email: dto.email };
      authService.signup.mockResolvedValue(created);

      await expect(controller.signup(dto)).resolves.toBe(created);
      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('pose le cookie httpOnly et ne renvoie que le user', async () => {
      const dto = { email: 'test@test.com', password: 'plaintext' };
      authService.login.mockResolvedValue({
        accessToken: 'tok',
        user: { id: 1, email: dto.email },
      });

      const result = await controller.login(dto, res as unknown as Response);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'tok',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
      );
      expect(result).toEqual({ id: 1, email: dto.email });
    });
  });

  describe('logout', () => {
    it('efface le cookie et renvoie {success: true}', async () => {
      const result = controller.logout(res as unknown as Response);

      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(result).toEqual({ success: true });
    });
  });

  describe('secure branch', () => {
    it('active secure:true quand NODE_ENV=production', async () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        authService.login.mockResolvedValue({
          accessToken: 'tok',
          user: { id: 1, email: 'test@test.com' },
        });
        await controller.login(
          { email: 'test@test.com', password: 'plaintext' },
          res as unknown as Response,
        );
        expect(res.cookie).toHaveBeenCalledWith(
          'access_token',
          'tok',
          expect.objectContaining({ secure: true }),
        );
      } finally {
        process.env.NODE_ENV = prev;
      }
    });
  });
});
