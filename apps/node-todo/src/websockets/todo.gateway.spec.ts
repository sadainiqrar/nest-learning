import { Test, TestingModule } from '@nestjs/testing';
import { TodoGateway } from './todo.gateway';
import { WsJwtGuard } from '../user/socket.guard'; // Ensure correct import path
import { TokenService } from '../user/token.service'; // Ensure correct import path

describe('TodoGateway', () => {
  let gateway: TodoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoGateway,
        WsJwtGuard, // Ensure this provider is added
        {
          provide: TokenService,
          useValue: {
            validateToken: jest.fn(),
          },
        }, // Ensure this provider is added
      ],
    }).compile();

    gateway = module.get<TodoGateway>(TodoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  // ...existing tests...
});
