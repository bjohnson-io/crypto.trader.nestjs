import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Level2Snapshot, Level2Update, OrderbookUpdatePayload } from './app.interfaces';
import { InjectEventEmitter } from 'nest-emitter';
import { EventBus } from './app.events';
import { OrderBookStore } from 'orderbook-synchronizer';
import { Order } from 'orderbook-synchronizer/lib/types';
import { OrderbookBuffer } from './orderbook.buffer';
import { config } from './app.config';
/**
 * The OrderbookManager listens for new market data being emitted by
 * the CollectorService. It stores this data in a temporary buffer until,
 * at the specified interval, it flushes the buffer and updates the 
 * orderbook. On update, it emits events over the EventBus which are
 * caught by the WebsocketGateway. The WS Gateway will broadcast these
 * updates to the client app as it receives them.
 * 
 * The flush interval can be adjusted by changing the throttle.orderbook 
 * variable in the app.config file.
 * 
 * --- SIDE NOTE ---
 * Sync'ing the exchange's orderbook to a local version in the
 * (server-side) app + sync'ing the orderbook in the client app to the
 * one in this app is actually a pain in the ass. To keep everything
 * running like clockwork, I implemented a buffer with an adjustable
 * flush interval.  This ensures updates are broadcasted to the client
 * at regular intervals (10x a second by default) and keeps the
 * performance level during periods of high trading activity.
 */
export interface SequenceTracker {
  [key: string]: number
}

@Injectable()
export class OrderbookManager implements OnModuleInit {
  private logger = new Logger('OrderbookManager');
  private store = new OrderBookStore(25000);
  private buffer = new OrderbookBuffer();
  private bufferFlushInterval: NodeJS.Timeout;
  private sequence: SequenceTracker = {};

  constructor(
    @InjectEventEmitter() private readonly eventBus: EventBus
  ) { }

  onModuleInit() {
    this.logger.log('Initialized');
    this.eventBus.on('collector.l2snapshot', (x) => this.addOrReplaceOrderbook(x.market.id, x.l2snapshot));
    this.eventBus.on('collector.l2update', (x) => this.bufferOrderbookUpdate(x.market.id, x.l2update));
    this.setBufferFlushInterval(config.throttle.orderbook);
  }

  getOrderbook(symbol: string): OrderbookUpdatePayload {
    const { asks, bids } = this.store.getOrderBook(symbol) || { asks: [], bids: [] };
    const sequence = this.getSequence(symbol);
    return { symbol, sequence, asks, bids };
  }
  
  bufferOrderbookUpdate(symbol: string, data: Level2Update): void {
    const asks: Order[] = data.asks.map(a => [Number(a.price), Number(a.size)]);
    const bids: Order[] = data.bids.map(b => [Number(b.price), Number(b.size)]);
    this.buffer.write(symbol, asks, bids);
    // this.logger.debug(`Buffer write: [${symbol}] ${asks.length} asks, ${bids.length} bids`);
  }

  addOrReplaceOrderbook(symbol: string, data: Level2Snapshot): void {
    this.buffer.flush(symbol);
    const ob = this.store._data.get(symbol);
    if (ob) {
      ob.asks = [];
      ob.bids = [];
    }
    const asks: Order[] = data.asks.map(a => [Number(a.price), Number(a.size)]);
    const bids: Order[] = data.bids.map(b => [Number(b.price), Number(b.size)]);
    this.store.updateOrderBook(symbol, asks, bids);
    this.resetSequence(symbol);
    const sequence = this.incrementSequence(symbol);
    this.eventBus.emit('orderbook.snapshot', { symbol, sequence, asks, bids });
    // this.logger.debug(`[${sequence}] Add Orderbook: [${symbol}] ${asks.length} asks, ${bids.length} bids`);
  }

  hasOrderbook(symbol: string): boolean {
    return this.store.hasOrderBook(symbol);
  }

  getSymbolList(): string[] {
    return this.store.getSymbolList();
  }

  setBufferFlushInterval(milliseconds: number) {
    if (this.bufferFlushInterval) {
      clearInterval(this.bufferFlushInterval);
    }
    this.bufferFlushInterval = setInterval(() => {
      for (let symbol of this.buffer.keys()) {
        const { asks, bids } = this.buffer.flush(symbol);
        this.store.updateOrderBook(symbol, asks, bids);
        const sequence = this.incrementSequence(symbol);
        this.eventBus.emit('orderbook.update', { symbol, sequence, asks, bids });
        // this.logger.debug(`[${sequence}] Buffer flushed: [${symbol}] ${asks.length} asks, ${bids.length} bids`);
      }
    }, milliseconds);
  }

  private incrementSequence(symbol: string): number {
    if (!this.sequence[symbol])
      this.sequence[symbol] = 0;
    return ++this.sequence[symbol];
  }

  private resetSequence(symbol: string) {
    this.sequence[symbol] = 0;
  }

  private getSequence(symbol: string): number {
    if (!this.sequence[symbol])
      this.sequence[symbol] = 0;
    return this.sequence[symbol];
  }

}
