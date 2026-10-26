import { ExecutionContext } from '@nestjs/common';
import { currentUserFactory } from './current-user.decorator';

describe('currentUserFactory', () => {
  it('renvoie req.user', () => {
    const user = { userId: 14, email: 'a@b.c' };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext;

    expect(currentUserFactory(undefined, ctx)).toBe(user);
  });
});
