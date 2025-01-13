import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './user.service';
import { TokenService } from './token.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
          },
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return user', async () => {
      const payload = { id: 1, username: 'testuser' };
      const user = await strategy.validate(payload);
      expect(user).toEqual({ id: 1, username: 'testuser' });
      expect(userService.findUserById).toHaveBeenCalledWith(1, 'testuser');
    });
  });
});
