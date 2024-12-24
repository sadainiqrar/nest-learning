import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from './token.service'; // The service to verify tokens
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('here here')
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token as string;

    if (!token) {
      console.error('Token not provided');
      return false;
    }

    try {
      const payload = await this.tokenService.verifyToken(token);
      client.data.user = payload; // Attach the user data to the client
      return true;
    } catch (error) {
      console.error('Invalid token:', error.message);
      return false;
    }
  }
}
