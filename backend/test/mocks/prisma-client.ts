export class PrismaClient {}

export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  constructor(
    message: string,
    { code, meta }: { code: string; meta?: Record<string, unknown> },
  ) {
    super(message);
    this.code = code;
    this.meta = meta;
  }
}

export const Prisma = { PrismaClientKnownRequestError };
