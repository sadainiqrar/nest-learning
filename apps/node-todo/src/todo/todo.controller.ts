import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { RolesGuard } from '../user/roles.guard';
import { Roles } from '../user/roles.decorator';

@Controller('todos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Roles('Admin', 'User')
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'User')
  findOne(@Param('id') id: number): Promise<Todo> {
    return this.todoService.findOne(+id);
  }

  @Post()
  @Roles('Admin', 'User')
  create(@Body() todo: Partial<Todo>): Promise<Todo> {
    return this.todoService.create(todo);
  }

  @Patch(':id')
  @Roles('Admin')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<Todo>
  ): Promise<Todo> {
    return this.todoService.update(+id, updateData);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.todoService.remove(+id);
  }
}
