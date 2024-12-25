import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
