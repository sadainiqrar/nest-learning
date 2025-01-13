/* eslint-disable @nx/enforce-module-boundaries */
import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserType } from './user.entity';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'testuser' },
        password: { type: 'string', example: 'testpass' },
        role: { type: 'string', enum: ['Admin', 'User'], example: 'Admin' },
      },
    },
  })
  async signUp(
    @Body() body: { username: string; password: string; role: UserType }
  ) {
    const { username, password, role } = body;
    return this.userService.signUp(username, password, role);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'testuser' },
        password: { type: 'string', example: 'testpass' },
      },
    },
  })
  async signIn(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.signIn(username, password);
  }
}
