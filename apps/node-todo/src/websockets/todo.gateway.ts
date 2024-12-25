import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ExecutionContext } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../user/socket.guard';

@WebSocketGateway({ namespace: '/todos' })
export class TodoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly wsJwtGuard: WsJwtGuard,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
      getHandler: () => null,
      getClass: () => TodoGateway,
    } as unknown as ExecutionContext;

    const isAuthorized = await this.wsJwtGuard.canActivate(context);
    if (!isAuthorized) {
      console.log(`Unauthorized client: ${client.id}`);
      client.disconnect(); // Disconnect unauthorized client
      return;
    }
    console.log(`Client connected: ${client.id}`);
    this.server.emit('connected', `this one ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
