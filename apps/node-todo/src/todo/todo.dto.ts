import { IsString, IsOptional,IsNotEmpty, IsEnum } from 'class-validator';
import { TodoStatus } from './todo.entity';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(TodoStatus, { message: 'Status must be Pending, In Progress, or Completed' })
  status?: TodoStatus = TodoStatus.PENDING;
}