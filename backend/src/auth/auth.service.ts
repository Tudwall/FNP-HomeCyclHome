import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly appUser: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.appUser.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const pwdHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await this.appUser.create({
      email: dto.email,
      password: pwdHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.appUser.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: { id: user.id, email: user.email } };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.appUser.findCredentialsById(userId);
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new ForbiddenException('Mot de passe incorrect');
    }

    const hash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);
    await this.appUser.updatePassword(userId, hash);
  }
}
