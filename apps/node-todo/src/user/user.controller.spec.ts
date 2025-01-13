import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserType } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ message: 'User created successfully' }),
            signIn: jest.fn().mockResolvedValue({ access_token: 'test-token' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call UserService.signUp and return result', async () => {
      const body = { username: 'testuser', password: 'testpass', role: UserType.USER };
      const result = await controller.signUp(body);
      expect(result).toEqual({ message: 'User created successfully' });
      expect(service.signUp).toHaveBeenCalledWith('testuser', 'testpass', UserType.USER);
    });
  });

  describe('signIn', () => {
    it('should call UserService.signIn and return result', async () => {
      const body = { username: 'testuser', password: 'testpass' };
      const result = await controller.signIn(body);
      expect(result).toEqual({ access_token: 'test-token' });
      expect(service.signIn).toHaveBeenCalledWith('testuser', 'testpass');
    });
  });
});
