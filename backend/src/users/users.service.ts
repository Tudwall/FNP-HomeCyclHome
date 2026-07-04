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
    return this.prisma.app_user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number): Promise<appUser> {
    return this.prisma.app_user.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
  }
}
