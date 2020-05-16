import { Market } from './app.interfaces';

interface ThrottleConfig {
    ticker: number
    orderbook: number
}

export interface AppConfig {
    debug: boolean
    exchange: 'coinbasepro' // Will add more later
    markets: Market[]
    throttle: ThrottleConfig
}

export const config: AppConfig = {
    debug: false,
    exchange: 'coinbasepro',
    markets: [
        { id: 'BTC-USD', base: 'BTC', quote: 'USD' }
    ],
    throttle: {
        ticker: 1000,
        orderbook: 1000
    }
}
