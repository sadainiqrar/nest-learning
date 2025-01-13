import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ id: 1, username: 'testuser' }),
            decode: jest.fn().mockReturnValue({ id: 1, username: 'testuser' }),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyToken', () => {
    it('should verify a token', () => {
      const token = 'test-token';
      const payload = service.verifyToken(token);
      expect(payload).toEqual({ id: 1, username: 'testuser' });
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', () => {
      const token = 'test-token';
      const payload = service.decodeToken(token);
      expect(payload).toEqual({ id: 1, username: 'testuser' });
    });
  });
});