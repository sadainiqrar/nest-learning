import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo, TodoStatus } from './todo.entity';
import { CreateTodoDto } from './todo.dto';
import { WsJwtGuard } from '../user/socket.guard'; // Ensure correct import path
import { TokenService } from '../user/token.service'; // Ensure correct import path
import { TodoGateway } from '../websockets/todo.gateway'; // Ensure correct import path

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        WsJwtGuard, // Ensure this provider is added
        {
          provide: TokenService,
          useValue: {
            validateToken: jest.fn(),
          },
        }, // Ensure this provider is added
        TodoGateway, // Ensure this provider is added
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = [
        {
          id: 1,
          title: 'Test',
          description: 'Test',
          status: TodoStatus.PENDING,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = {
        id: 1,
        title: 'Test',
        description: 'Test',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const dto = { title: 'Test', description: 'Test' };
      const result = {
        id: 1,
        ...dto,
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return a todo', async () => {
      const status = TodoStatus.COMPLETED;
      const result = {
        id: 1,
        title: 'Test',
        description: 'Test',
        status,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, status)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
