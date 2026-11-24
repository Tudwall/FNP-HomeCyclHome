import type { Request } from 'express';
import { cookieExtractor, JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStategy', () => {
  describe('cookieExtractor', () => {
    it('extrait le token depuis le cookie access_token', () => {
      const req = { cookies: { access_token: 'tok' } } as unknown as Request;
      expect(cookieExtractor(req)).toBe('tok');
    });

    it('renvoie null si aucun cookie', () => {
      expect(cookieExtractor({} as unknown as Request)).toBeNull();
    });

    it('renvoie null si req est null/undefined', () => {
      expect(cookieExtractor(null as unknown as Request)).toBeNull();
      expect(cookieExtractor(undefined as unknown as Request)).toBeNull();
    });
  });

  describe('validate', () => {
    let strategy: JwtStrategy;
    let users: { findById: jest.Mock };

    beforeEach(() => {
      const config = {
        getOrThrow: jest.fn().mockReturnValue('secret'),
      } as unknown as ConfigService;
      users = { findById: jest.fn() };
      strategy = new JwtStrategy(config, users as unknown as UsersService);
    });

    it('renvoie {userId,email} lus en bdd quand le user existe', async () => {
      users.findById.mockResolvedValue({ id: 5, email: 'db@b.com' });

      await expect(
        strategy.validate({ sub: 5, email: 'token@b.com' }),
      ).resolves.toEqual({ userId: 5, email: 'db@b.com' });
      expect(users.findById).toHaveBeenCalledWith(5);
    });

    it('rejette en 401 quand le user est supprimé ou inexistant', async () => {
      users.findById.mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: 5, email: 'a@b.com' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
