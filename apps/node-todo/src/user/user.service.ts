import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(username: string, password: string, role: UserType) {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    if (!Object.values(UserType).includes(role)) {
      throw new BadRequestException('Invalid role type');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    await this.userRepository.save(newUser);
    return { message: 'User created successfully' };
  }

  async signIn(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async findUserById(id: number, username: string) {
    return this.userRepository.findOne({ where: { id, username } });
  }
}
