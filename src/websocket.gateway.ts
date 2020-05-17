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
      this.server.to(`orderbook.${payload.symbol}`).emit('orderbookUpdate', { type: 'update', ...payload });
      console.log({ type: 'update', sym: payload.symbol, seq: payload.sequence, ask: payload.asks.length, bid: payload.bids.length });
    });
    this.eventBus.on('orderbook.snapshot', (payload) => {
      this.server.to(`orderbook.${payload.symbol}`).emit('orderbookSnapshot', { type: 'snapshot', ...payload });
      console.log({ type: 'snapshot', sym: payload.symbol, seq: payload.sequence, ask: payload.asks.length, bid: payload.bids.length });
    });
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
  handleOrderbookSubscription(client: Socket, symbol: string) {
    client.join(`orderbook.${symbol}`);
    client.emit('orderbookSubscriptionConfirmed', symbol);
    this.sendOrderbookSnapshot(client, symbol);
  }

  @SubscribeMessage('cancelOrderbookSubscription')
  handleCancelOrderbookSubscription(client: Socket, symbol: string) {
    client.leave(`orderbook.${symbol}`);
    client.emit('cancelOrderbookSubscriptionConfirmed', symbol);
  }

  @SubscribeMessage('requestOrderbookSnapshot')
  handleOrderbookSnapshotRequest(client: Socket, symbol: string) {
    this.sendOrderbookSnapshot(client, symbol);
  }

  private sendOrderbookSnapshot(client: Socket, symbol: string) {
    client.emit('orderbookSnapshot', this.orderbooks.getOrderbook(symbol));
  }

}
