import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signup: jest.Mock };

  beforeEach(async () => {
    authService = { signup: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('délègue à authService.signup', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'plaintext',
        firstName: 'Jean',
        lastName: 'Dupont',
      };
      const created = { id: 1, email: dto.email };
      authService.signup.mockResolvedValue(created);

      await expect(controller.signup(dto)).resolves.toBe(created);
      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });
});
