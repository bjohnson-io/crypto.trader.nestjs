import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { Level2SnapshotPayload, Level2UpdatePayload, OrderbookUpdatePayload } from './app.interfaces';

/**
 * This is where you add event types. Since we're using a
 * typed emitter (which provides that awesome intellisense)
 * we'll need to add those types here or you'll get a TS
 * type error.
 */

interface Events {
  'collector.l2snapshot': Level2SnapshotPayload
  'collector.l2update': Level2UpdatePayload
  'orderbook.update': OrderbookUpdatePayload
  'orderbook.snapshot': OrderbookUpdatePayload
}

export type EventBus = StrictEventEmitter<EventEmitter, Events>;