import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AppUser } from '../generated/prisma/client';
import { randomBytes } from 'crypto';

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

  anonymize(id: number) {
    const now = new Date();
    return this.prisma.$transaction([
      this.prisma.bike.updateMany({
        where: { userId: id, deletedOn: null },
        data: { deletedOn: now },
      }),
      this.prisma.appUser.update({
        where: { id, deletedOn: null },
        data: {
          email: `deleted-${id}@invalid`,
          firstName: 'Utilisateur',
          lastName: 'supprimé',
          password: randomBytes(32).toString('hex'),
          deletedOn: now,
        },
        select: { id: true },
      }),
      this.prisma.address.updateMany({
        where: { userId: id },
        data: { number: null, street: 'Adresse supprimée' },
      }),
      this.prisma.address.updateMany({
        where: { userId: id, deletedOn: null },
        data: { deletedOn: now },
      }),
    ]);
  }

  findCredentialsById(id: number) {
    return this.prisma.appUser.findUnique({
      where: { id, deletedOn: null },
      select: { id: true, password: true },
    });
  }

  updatePassword(id: number, password: string) {
    return this.prisma.appUser.update({
      where: { id, deletedOn: null },
      data: { password },
      select: { id: true },
    });
  }
}
