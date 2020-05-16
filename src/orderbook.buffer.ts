import { Order } from 'orderbook-synchronizer/lib/types';

export interface OrderbookWriteBuffer {
    [key: string]: { asks: Map<number, number>, bids: Map<number, number> }
}

const price = 0;
const size = 1;

export class OrderbookBuffer {
    private buffer: OrderbookWriteBuffer = {};

    keys(): string[] {
        return Object.keys(this.buffer);
    }

    write(key: string, asks: Order[], bids: Order[]) {
        if (this.buffer.hasOwnProperty(key)) {
            for (let ask of asks) {
                this.buffer[key].asks.set(ask[price], ask[size])
            }
            for (let bid of bids) {
                this.buffer[key].bids.set(bid[price], bid[size])
            }
            return;      
        }
        this.buffer[key] = { asks: new Map(asks), bids: new Map(bids) };
    }

    flush(key: string): { asks: Order[], bids: Order[] } {
        if (this.buffer.hasOwnProperty(key)) {
            const asks = this.buffer[key].asks;
            this.buffer[key].asks.clear();
            const bids = this.buffer[key].bids;
            this.buffer[key].bids.clear();
            return { asks: this.transform(asks), bids: this.transform(bids) };
        }
        return { asks: [], bids: [] };
    }

    private transform(m: Map<number, number>): Order[] {
        let output = [];
        for (let x of [...m.keys()]) {
            output.push([x, m.get(x)]);
        }
        return output;
    }
}