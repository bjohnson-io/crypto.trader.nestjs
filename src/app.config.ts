import { Market } from './app.interfaces';

/**
 * This is the config file for our app.  We could use Nest's
 * ConfigModule, but it really seemed like overkill at this
 * time.
 */

export interface AppConfig {
    debug: boolean
    exchange: 'coinbasepro' // Will add more later
    markets: Market[]
    throttle: ThrottleConfig
}

interface ThrottleConfig {
    ticker: number
    orderbook: number
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
