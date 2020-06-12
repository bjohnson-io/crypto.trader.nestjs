import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ExchangeClient } from './app.interfaces';
import { config } from './app.config';
import * as ccxws from 'ccxws';
import { InjectEventEmitter } from 'nest-emitter';
import { EventBus } from './app.events';

/**
 * This is where we connect to one or more exchanges via websockets, 
 * subscribe to data streams we care about, & emit received data/events 
 * across the EventBus so other parts of our application can react to
 * them. Currently, only the OrderbookManager is configured to listen 
 * for the events emitted from the collector.  However, with this
 * de-coupled approach, we can create new services that listen for
 * these events and react to them in some way--such as a service
 * that listens for tickers and pushes the data into Postgres or
 * InfluxDB?
 * 
 * I'm using the ccxws library under the hood which should, theoretically,
 * allow us to connect to multiple exchanges with the same API.  I've only
 * tested it with Binance US & Coinbase Pro so far. To see what exchanges
 * are available, check the GH page: https://github.com/altangent/ccxws
 * 
 * You can set the exchange in the app.config file.
 */
export interface SequenceTracker {
    [key: string]: number
}

@Injectable()
export class CollectorService implements OnModuleInit {
    private logger = new Logger('CollectorService');
    private client: ExchangeClient = new ccxws[config.exchange]();
    constructor(@InjectEventEmitter() private readonly eventBus: EventBus) {}

    onModuleInit() {
        this.connectToExchanges();
        this.logger.log('Initialized');
    }

    /**
     * TODO: Currently only pulling L2 orderbook data. Need to pull
     *       ticker data, too. The orderbook was way more complicated
     *       so this should be simple by comparison.
     */
    private connectToExchanges() {
        this.client.name = config.exchange;
        this.client.on('error', err => console.log(err)); 
        this.client.on('l2snapshot', (l2snapshot, market) => {
            this.eventBus.emit('collector.l2snapshot', { l2snapshot, market });
        });
        this.client.on('l2update', (l2update, market) => {
            this.eventBus.emit('collector.l2update', { l2update, market });
        });
        for (let market of config.markets) {
            this.client.subscribeTicker(market);
            this.client.subscribeLevel2Updates(market);
        }
    }
}
