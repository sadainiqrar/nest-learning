import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { Todo, TodoStatus } from './todo.entity';
import { RolesGuard } from '../user/roles.guard';
import { Roles } from '../user/roles.decorator';
import { CreateTodoDto } from './todo.dto';
import { StatusValidationPipe } from './todo.status.validator';

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
  @UsePipes(ValidationPipe)
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  @Roles('Admin')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: number,
    @Body('status', StatusValidationPipe) status: TodoStatus
  ): Promise<Todo> {
    return this.todoService.update(+id, { status });
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.todoService.remove(+id);
  }
}
