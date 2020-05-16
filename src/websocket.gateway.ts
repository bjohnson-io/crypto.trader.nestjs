import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { OrderbookManager } from './orderbook.manager';
import { EventBus } from './app.events';

@WebSocketGateway({ namespace: 'ws' })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('WebsocketGateway');
  private server: Server;

  constructor(
    @InjectEventEmitter() private readonly eventBus: EventBus,
    private orderbooks: OrderbookManager
  ) { }

  afterInit(server: Server) {
    this.server = server;
    this.eventBus.on('orderbook.update', (payload) => {
      this.server.to(`orderbook.${payload.symbol}`).emit('orderbookUpdate', payload);
    })
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client ${client.id} connected.`);
    client.emit('symbolList', this.orderbooks.getSymbolList());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected.`);
  }

  @SubscribeMessage('orderbookSubscription')
  handleOrderbookSubscription(client: Socket, symbol: string ) {
    client.join(`orderbook.${symbol}`);
    client.emit('orderbookSubscriptionConfirmed', this.orderbooks.getOrderbook(symbol)); // Send snapshot on subscribe
  }

  @SubscribeMessage('cancelOrderbookSubscription')
  handleCancelOrderbookSubscription(client: Socket, symbol: string ) {
    client.leave(`orderbook.${symbol}`);
    client.emit('cancelOrderbookSubscriptionConfirmed', symbol);
  }

}
