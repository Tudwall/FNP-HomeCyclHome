import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AppUser, Prisma } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<AppUser> {
    return this.prisma.appUser.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.appUser.findMany({ where: { deletedOn: null } });
  }

  findById(id: number) {
    return this.prisma.appUser.findUnique({ where: { id, deletedOn: null } });
  }

  findByEmail(email: string): Promise<AppUser | null> {
    return this.prisma.appUser.findUnique({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<appUser> {
    try {
      return this.prisma.app_user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`User #${id} not fount`);
        }
        if (err.code === 'P2002') {
          throw new ConflictException('Conflict');
        }
      }
      throw err;
    }
  }

  remove(id: number): Promise<appUser> {
    try {
      return this.prisma.app_user.update({
        where: { id },
        data: { deletedOn: new Date() },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`User #${id} not found`);
      }
      throw err;
    }
  }
}
