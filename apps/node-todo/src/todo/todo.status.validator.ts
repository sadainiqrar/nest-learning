import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TodoStatus } from './todo.entity';

@Injectable()
export class StatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TodoStatus.PENDING,
    TodoStatus.IN_PROGRESS,
    TodoStatus.COMPLETED,
  ];

  transform(value: any) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}