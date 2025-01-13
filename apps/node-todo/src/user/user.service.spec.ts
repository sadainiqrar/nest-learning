import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserType } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockImplementation((password, hashedPassword) => {
    return password === 'testpass' && hashedPassword === 'hashedPassword';
  }),
}));
describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue({} as any);

      const result = await service.signUp(
        'testuser',
        'testpass',
        UserType.USER
      );
      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('should throw an error if username already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as any);

      await expect(
        service.signUp('testuser', 'testpass', UserType.USER)
      ).rejects.toThrow('Username already exists');
    });

    it('should throw an error if role is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.signUp('testuser', 'testpass', 'invalid-role' as UserType)
      ).rejects.toThrow('Invalid role type');
    });
  });

  describe('signIn', () => {
    it('should return a token for valid credentials', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        role: UserType.USER,
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.signIn('testuser', 'testpass');
      expect(result).toEqual({ access_token: 'test-token' });
    });

    it('should throw an error for invalid credentials', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.signIn('testuser', 'testpass')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user by id and username', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as any);

      const result = await service.findUserById(1, 'testuser');
      expect(result).toEqual({});
    });
  });
});
