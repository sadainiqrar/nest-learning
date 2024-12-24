import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {  UserType } from './user.entity';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  async signUp(
    @Body() body: { username: string; password: string; role: UserType },
  ) {
    const { username, password, role } = body;
    return this.userService.signUp(username, password, role);
  }

  @Post('signin')
  async signIn(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.signIn(username, password);
  }
}
