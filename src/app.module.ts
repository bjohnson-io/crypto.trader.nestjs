import { Module } from '@nestjs/common';
import { NestEmitterModule } from 'nest-emitter';
import { AppController } from './app.controller';
import { OrderbookManager } from './orderbook.manager';
import { WebsocketGateway } from './websocket.gateway';
import { CollectorService } from './collector.service';
import { EventEmitter } from 'events';

@Module({
  imports: [NestEmitterModule.forRoot(new EventEmitter())],
  controllers: [AppController],
  providers: [
    CollectorService, 
    OrderbookManager, 
    WebsocketGateway,
  ],
})
export class AppModule {}
