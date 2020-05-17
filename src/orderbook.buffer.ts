import { Order } from 'orderbook-synchronizer/lib/types';

interface InternalBuffer {
    [key: string]: { asks: Map<number, number>, bids: Map<number, number> }
}
const price = 0;
const size = 1;

export class OrderbookBuffer {
    private buffer: InternalBuffer = {};

    keys(): string[] {
        return Object.keys(this.buffer);
    }

    write(symbol: string, asks: Order[], bids: Order[]) {
        if (this.buffer.hasOwnProperty(symbol)) {
            for (let ask of asks) {
                this.buffer[symbol].asks.set(ask[price], ask[size])
            }
            for (let bid of bids) {
                this.buffer[symbol].bids.set(bid[price], bid[size])
            }
            return;      
        }
        this.buffer[symbol] = { asks: new Map(asks), bids: new Map(bids) };
    }

    flush(symbol: string): { asks: Order[], bids: Order[] } {
        if (this.buffer.hasOwnProperty(symbol)) {
            const { asks, bids } = this.buffer[symbol];
            const output = { asks: this.transform(asks), bids: this.transform(bids) };
            this.buffer[symbol].asks.clear();
            this.buffer[symbol].bids.clear();
            return output;
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