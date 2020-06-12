import { Module } from '@nestjs/common';
import { NestEmitterModule } from 'nest-emitter';
import { AppController } from './app.controller';
import { OrderbookManager } from './orderbook.manager';
import { WebsocketGateway } from './websocket.gateway';
import { CollectorService } from './collector.service';
import { EventEmitter } from 'events';

/**
 * The AppModule is the root app module--in our small app,
 * it is the only module--that loads the various services 
 * we'll be using to fulfill requests.
 */
@Module({
  imports: [NestEmitterModule.forRoot(new EventEmitter())], // <-- provides that typed EventEmiiter! :)
  controllers: [AppController], // <-- contains our REST endpoints
  providers: [
    CollectorService, // <-- pulls data from the exchange 
    OrderbookManager, // <-- manages sync'ing of L2 orderbook
    WebsocketGateway, // <-- handles WS requests (like a controller for WS)
  ],
})
export class AppModule {}
