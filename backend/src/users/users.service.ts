import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.app_user.create(createUserDto);
  }

  findAll() {
    return this.prisma.app_user.findAll();
  }

  findById(id: number) {
    return this.prisma.app_user.findUnique(id);
  }

  findByEmail(CreateUserDto): Promise<User | null> {
    return this.prisma.app_user.findUnique(CreateUserDto.email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
