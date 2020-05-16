import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { Level2SnapshotPayload, Level2UpdatePayload, OrderbookUpdatePayload } from './app.interfaces';

interface Events {
  'ccxws.l2snapshot': Level2SnapshotPayload
  'ccxws.l2update': Level2UpdatePayload
  'orderbook.update': OrderbookUpdatePayload
}

export type EventBus = StrictEventEmitter<EventEmitter, Events>;