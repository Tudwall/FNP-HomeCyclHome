import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AppUser } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<AppUser> {
    return this.prisma.appUser.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.appUser.findMany({
      where: { deletedOn: null },
      omit: { password: true },
    });
  }

  findById(id: number) {
    return this.prisma.appUser.findUnique({
      where: { id, deletedOn: null },
      omit: { password: true },
    });
  }

  findByEmail(email: string): Promise<AppUser | null> {
    return this.prisma.appUser.findUnique({
      where: { email, deletedOn: null },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.appUser.update({
      where: { id, deletedOn: null },
      data: updateUserDto,
      omit: { password: true },
    });
  }

  remove(id: number) {
    return this.prisma.appUser.update({
      where: { id, deletedOn: null },
      data: { deletedOn: new Date() },
      omit: { password: true },
    });
  }
}
