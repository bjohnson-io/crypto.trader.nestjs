import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { Level2SnapshotPayload, Level2UpdatePayload, OrderbookUpdatePayload } from './app.interfaces';

interface Events {
  'collector.l2snapshot': Level2SnapshotPayload
  'collector.l2update': Level2UpdatePayload
  'orderbook.update': OrderbookUpdatePayload
  'orderbook.snapshot': OrderbookUpdatePayload
}

export type EventBus = StrictEventEmitter<EventEmitter, Events>;