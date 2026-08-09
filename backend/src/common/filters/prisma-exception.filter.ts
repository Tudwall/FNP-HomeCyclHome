import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const { status, message } = this.map(exception);

    httpAdapter.reply(
      ctx.getResponse(),
      { statusCode: status, message, error: HttpStatus[status] },
      status,
    );
  }

  private map(e: PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2025': // Introuvable
        return { status: HttpStatus.NOT_FOUND, message: 'Resource not found' };
      case 'P2002': {
        // Conflit
        const target = (e.meta?.target as string[] | undefined)?.join(', ');
        return {
          status: HttpStatus.CONFLICT,
          message: target
            ? `Unique constraint failed on ${target}`
            : 'Unique constraint failed',
        };
      }
      case 'P2003': // FK invalide
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Related record not found',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
        };
    }
  }
}
