import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo, TodoStatus } from './todo.entity';
import { Repository } from 'typeorm';

import { TodoGateway } from '../websockets/todo.gateway';
import { WsJwtGuard } from '../user/socket.guard';
import { TokenService } from '../user/token.service';
import { JwtService } from '@nestjs/jwt';
describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;
  let gateway: TodoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoGateway,
          useValue: {
            server: {
              emit: jest.fn(),
            },
          },
        },
        {
          provide: WsJwtGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: TokenService,
          useValue: {
            verifyToken: jest.fn().mockResolvedValue({ id: 1, username: 'test' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockResolvedValue({ id: 1, username: 'test' }),
          },
        },
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));   
    gateway = module.get<TodoGateway>(TodoGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = [{ id: 1, title: 'Test', description: 'Test', status: TodoStatus.PENDING, createdAt: new Date() }];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = { id: 1, title: 'Test', description: 'Test', status: TodoStatus.PENDING, createdAt: new Date() };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const todo = { title: 'Test', description: 'Test' };
      const result = { id: 1, ...todo, status: TodoStatus.PENDING, createdAt: new Date() };
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(todo)).toBe(result);    
      expect(gateway.server.emit).toHaveBeenCalledWith('todoCreated', result);
   
    });
  });

  describe('update', () => {
    it('should update and return a todo', async () => {
      const result = { id: 1, title: 'Test', description: 'Test', status: TodoStatus.COMPLETED, createdAt: new Date() };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(result);
  
      const updatedTodo = await service.update(1, { status: TodoStatus.COMPLETED });
      expect(updatedTodo).toEqual(result);    
      expect(gateway.server.emit).toHaveBeenCalledWith('todoUpdated', result);

    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      expect(await service.remove(1)).toBeUndefined();
    });
  });
});
