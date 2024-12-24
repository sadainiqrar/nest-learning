import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
  } from '@nestjs/websockets';

  // import {AuthGuard} from '@nestjs/passport';
  import { UseGuards } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  import {WsJwtGuard} from '../user/socket.guard';
  
  @WebSocketGateway({ namespace: '/todos' })
  @UseGuards(WsJwtGuard)
  export class TodoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    handleConnection(client: Socket) {    
      console.log(`Client connected: ${client.id}`);
      this.server.emit('connected', `this one ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  }