import type { Request } from 'express';
import { cookieExtractor, JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

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
    it('mappe le payload vers {userId, email}', () => {
      const config = {
        getOrThrow: jest.fn().mockReturnValue('secret'),
      } as unknown as ConfigService;
      const strategy = new JwtStrategy(config);

      expect(strategy.validate({ sub: 5, email: 'a@b.com' })).toEqual({
        userId: 5,
        email: 'a@b.com',
      });
    });
  });
});
