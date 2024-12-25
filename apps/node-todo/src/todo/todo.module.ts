import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { UserModule } from '../user/user.module';
import { TodoGateway } from '../websockets/todo.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
  providers: [TodoService, TodoGateway],
  controllers: [TodoController]
})
export class TodoModule {}
