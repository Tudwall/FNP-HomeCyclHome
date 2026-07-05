import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from 'src/generated/prisma/client';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let reply: jest.Mock;
  let host: ArgumentsHost;
  const response = {};

  beforeEach(() => {
    reply = jest.fn();

    const httpAdapterHost = {
      httpAdapter: { reply },
    } as unknown as HttpAdapterHost;

    filter = new PrismaExceptionFilter(httpAdapterHost);

    host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as unknown as ArgumentsHost;
  });

  const buildError = (code: string, meta?: Record<string, unknown>) =>
    new Prisma.PrismaClientKnownRequestError('boom', { code, meta });

  it('P2025 -> 404', () => {
    filter.catch(buildError('P2025'), host);

    expect(reply).toHaveBeenCalledWith(
      response,
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        error: 'NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  });

  it('P2002 -> 409 avec cible dans le message', () => {
    filter.catch(buildError('P2002', { target: ['email'] }), host);

    expect(reply).toHaveBeenCalledWith(
      response,
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed on email',
      }),
      HttpStatus.CONFLICT,
    );
  });

  it('P2002 sans meta.target -> message générique', () => {
    filter.catch(buildError('P2002'), host);
    expect(reply).toHaveBeenCalledWith(
      response,
      expect.objectContaining({ message: 'Unique constraint failed' }),
      HttpStatus.CONFLICT,
    );
  });

  it('P2003 -> 400', () => {
    filter.catch(buildError('P2003'), host);

    expect(reply).toHaveBeenCalledWith(
      response,
      expect.objectContaining({ statusCode: HttpStatus.BAD_REQUEST }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('code inconnu -> 500', () => {
    filter.catch(buildError('P9999'), host);

    expect(reply).toHaveBeenCalledWith(
      response,
      expect.objectContaining({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
