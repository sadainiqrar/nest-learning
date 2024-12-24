import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  private todoCache: Todo[] = []; // In-memory cache for todos

  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoRepository.find();

    return todos;
  }

  async findOne(id: number): Promise<Todo> {

    const todo = await this.todoRepository.findOneBy({ id });

    return todo;
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.todoRepository.create(todo);
    const savedTodo = await this.todoRepository.save(newTodo);
    return savedTodo;
  }

  async update(id: number, updateData: Partial<Todo>): Promise<Todo> {
    await this.todoRepository.update(id, updateData);
    const updatedTodo = await this.todoRepository.findOneBy({ id });

    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    const existingTodo = await this.todoRepository.findOneBy({ id });

    if (existingTodo) {
      await this.todoRepository.delete(id);
    }
  }
}