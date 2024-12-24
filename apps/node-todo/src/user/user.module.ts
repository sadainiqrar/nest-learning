import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { TokenService } from './token.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Use a secure key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, TokenService],
  controllers: [UserController],
  exports: [UserService, TokenService],
})
export class UserModule {}
