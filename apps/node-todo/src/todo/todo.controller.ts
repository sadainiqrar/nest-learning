/* eslint-disable @nx/enforce-module-boundaries */
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
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { Todo, TodoStatus } from './todo.entity';
import { RolesGuard } from '../user/roles.guard';
import { Roles } from '../user/roles.decorator';
import { CreateTodoDto } from './todo.dto';
import { StatusValidationPipe } from './todo.status.validator';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Roles('Admin', 'User')
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of todos' })
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'User')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: number): Promise<Todo> {
    return this.todoService.findOne(+id);
  }

  @Post()
  @Roles('Admin', 'User')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
    type: CreateTodoDto,
    examples: {
      example1: {
        summary: 'Example Todo',
        value: {
          title: 'Sample Todo',
          description: 'This is a sample todo item',
          status: 'Pending',
        },
      },
    },
  })
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  @Roles('Admin')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update a todo status' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['Pending', 'In Progress', 'Completed'],
          example: 'In Progress',
        },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body('status', StatusValidationPipe) status: TodoStatus
  ): Promise<Todo> {
    return this.todoService.update(+id, { status });
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.todoService.remove(+id);
  }
}
