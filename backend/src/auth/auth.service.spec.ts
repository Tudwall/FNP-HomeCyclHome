import bcrypt from 'bcrypt';
jest.mock('bcrypt');
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let users: {
    findByEmail: jest.Mock;
    create: jest.Mock;
    findCredentialsById: jest.Mock;
    updatePassword: jest.Mock;
  };
  let jwt: { signAsync: jest.Mock };

  const dto: CreateUserDto = {
    email: 'test@test.com',
    password: 'plaintext',
    firstName: 'Jean',
    lastName: 'Dupont',
  };

  beforeEach(async () => {
    users = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findCredentialsById: jest.fn(),
      updatePassword: jest.fn(),
    };
    jwt = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('rejette si email existe déjà et ne crée rien', async () => {
      users.findByEmail.mockResolvedValue({ id: 1, email: dto.email });

      await expect(service.signup(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(users.create).not.toHaveBeenCalled();
    });

    it('hash mot de passe, crée utilisateur et renvoie {id, email}', async () => {
      users.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pwd');
      users.create.mockResolvedValue({ id: 42, email: dto.email });

      const result = await service.signup(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(users.create).toHaveBeenCalledWith({
        email: dto.email,
        password: 'hashed-pwd',
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
      expect(result).toEqual({ id: 42, email: dto.email });
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'plaintext' };

    it('rejette si aucun user, sans comparer le hash', async () => {
      users.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('rejette si le mot de passe ne matche pas', async () => {
      users.findByEmail.mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });

    it('renvoie accessToken + user quand les credentials sont bons', async () => {
      users.findByEmail.mockResolvedValue({
        id: 7,
        email: loginDto.email,
        password: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.signAsync.mockResolvedValue('signed-token');

      const result = await service.login(loginDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, 'hash');
      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: 7,
        email: loginDto.email,
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        user: { id: 7, email: loginDto.email },
      });
    });
  });

  describe('changePassword', () => {
    const pwdDto = {
      currentPassword: 'old-password',
      newPassword: 'new-password',
    };

    it('rejette si le user est introuvable, sans comparer ou écrire', async () => {
      users.findCredentialsById.mockResolvedValue(null);

      await expect(service.changePassword(7, pwdDto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(users.updatePassword).not.toHaveBeenCalled();
    });

    it('rejette si le mot de passe actuel ne matche pas, sans écrire', async () => {
      users.findCredentialsById.mockResolvedValue({
        id: 7,
        password: 'old-hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(7, pwdDto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(users.updatePassword).not.toHaveBeenCalled();
    });

    it('hash le nouveau mot de passe et le sauvegarde', async () => {
      users.findCredentialsById.mockResolvedValue({
        id: 7,
        password: 'old-hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      users.updatePassword.mockResolvedValue({ id: 7 });

      await expect(service.changePassword(7, pwdDto)).resolves.toBeUndefined();

      expect(users.findCredentialsById).toHaveBeenCalledWith(7);
      expect(bcrypt.compare).toHaveBeenCalledWith('old-password', 'old-hash');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(users.updatePassword).toHaveBeenCalledWith(7, 'new-hash');
    });
  });
});
