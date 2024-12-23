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
    console.log('Fetching all todos from the database...');

    const todos = await this.todoRepository.find();

    // Update the in-memory cache using process.nextTick
    process.nextTick(() => {
      this.updateCache(todos);
    });

    // Log analytics data using setImmediate
    setImmediate(() => {
      this.logAnalytics('findAll', todos);
    });

    return todos;
  }

  async findOne(id: number): Promise<Todo> {
    console.log(`Fetching todo with id ${id}...`);

    const todo = await this.todoRepository.findOneBy({ id });

    if (todo) {
      process.nextTick(() => {
        console.log(`Validating fetched todo with id ${id}`);
        this.validateTodo(todo); // Example of a quick validation task
      });

      setImmediate(() => {
        this.logAnalytics('findOne', [todo]);
      });
    }

    return todo;
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    console.log('Creating a new todo...');
    const newTodo = this.todoRepository.create(todo);
    const savedTodo = await this.todoRepository.save(newTodo);

    process.nextTick(() => {
      this.updateCacheWithNew(savedTodo);
    });

    setImmediate(() => {
      this.logAnalytics('create', [savedTodo]);
    });

    return savedTodo;
  }

  async update(id: number, updateData: Partial<Todo>): Promise<Todo> {
    console.log(`Updating todo with id ${id}...`);
    await this.todoRepository.update(id, updateData);
    const updatedTodo = await this.todoRepository.findOneBy({ id });

    if (updatedTodo) {
      process.nextTick(() => {
        this.updateCacheWithUpdate(updatedTodo);
      });

      setImmediate(() => {
        this.logAnalytics('update', [updatedTodo]);
      });
    }

    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    console.log(`Removing todo with id ${id}...`);
    const existingTodo = await this.todoRepository.findOneBy({ id });

    if (existingTodo) {
      await this.todoRepository.delete(id);

      process.nextTick(() => {
        this.removeFromCache(id);
      });

      setImmediate(() => {
        this.logAnalytics('remove', [existingTodo]);
      });
    }
  }

  // Private methods for cache and logging
  private updateCache(todos: Todo[]) {
    console.log('Updating in-memory cache...');
    this.todoCache = todos;
  }

  private updateCacheWithNew(todo: Todo) {
    console.log('Adding new todo to in-memory cache...');
    this.todoCache.push(todo);
  }

  private updateCacheWithUpdate(todo: Todo) {
    console.log('Updating in-memory cache with updated todo...');
    const index = this.todoCache.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todoCache[index] = todo;
    }
  }

  private removeFromCache(id: number) {
    console.log(`Removing todo with id ${id} from in-memory cache...`);
    this.todoCache = this.todoCache.filter((t) => t.id !== id);
  }

  private logAnalytics(action: string, data: Todo[]) {
    console.log(`Logging action "${action}" with data:`, data);
    // Real-world logic for logging or sending analytics data
  }

  private validateTodo(todo: Todo) {
    console.log(`Validating todo with id ${todo.id}:`, todo);
    // Add any lightweight validation logic here
  }
}
