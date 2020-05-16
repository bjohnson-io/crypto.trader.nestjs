import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ExchangeClient } from './app.interfaces';
import { config } from './app.config';
import * as ccxws from 'ccxws';
import { InjectEventEmitter } from 'nest-emitter';
import { EventBus } from './app.events';

export interface SequenceTracker {
    [key: string]: number
}

/**
 * This is where we connect to one or more exchanges via websockets, 
 * subscribe to data streams we care about, & call the InfluxService
 * to push the data into the database.
 */
@Injectable()
export class CollectorService implements OnModuleInit {
    private logger = new Logger('CollectorService');
    private client: ExchangeClient = new ccxws[config.exchange]();
    constructor(@InjectEventEmitter() private readonly eventBus: EventBus) {}

    onModuleInit() {
        this.connectToExchanges();
        this.logger.log('Initialized');
    }

    private connectToExchanges() {
        this.client.name = config.exchange;
        this.client.on('error', err => console.log(err)); 
        this.client.on('l2snapshot', (l2snapshot, market) => {
            this.eventBus.emit('ccxws.l2snapshot', { l2snapshot, market });
        });
        this.client.on('l2update', (l2update, market) => {
            this.eventBus.emit('ccxws.l2update', { l2update, market });
        });
        for (let market of config.markets) {
            this.client.subscribeTicker(market);
            this.client.subscribeLevel2Updates(market);
        }
    }
}
