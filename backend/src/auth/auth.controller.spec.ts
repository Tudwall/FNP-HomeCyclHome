import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Request, Response } from 'express';

const reqAs = (userId: number) =>
  ({ user: { userId, email: 'test@test.com' } }) as unknown as Request;

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signup: jest.Mock; login: jest.Mock };
  let usersService: { findById: jest.Mock };
  let res: { cookie: jest.Mock; clearCookie: jest.Mock };

  beforeEach(async () => {
    authService = { signup: jest.fn(), login: jest.fn() };
    usersService = { findById: jest.fn() };
    res = { cookie: jest.fn(), clearCookie: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    })
      // Le quota est un comportement d'infrastructure, testé ailleurs.
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

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
    it('efface le cookie et renvoie {success: true}', () => {
      const result = controller.logout(res as unknown as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('me', () => {
    it('renvoie le user courant', async () => {
      const user = { id: 1, email: 'test@test.com' };
      usersService.findById.mockResolvedValue(user);

      await expect(controller.me(reqAs(1))).resolves.toBe(user);
      expect(usersService.findById).toHaveBeenCalledWith(1);
    });

    it('401 si le compte n’existe plus (token encore valide)', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(controller.me(reqAs(1))).rejects.toThrow(
        UnauthorizedException,
      );
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
