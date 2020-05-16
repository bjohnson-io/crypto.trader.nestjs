/**
 *  These TypeScript interfaces are defined for better IDE 
 *  intellisense during the development process. Keep in
 *  mind that they do not exist at runtime; once TS 
 *  compiles to JS, they no longer exist.
 */

import { Order } from 'orderbook-synchronizer/lib/types'

export interface Market { 
    id: string
    base: string
    quote: string
} 

export interface ExchangeClient {
    name?: string 
    reconnectIntervalMs: number
    readonly hasTickers: boolean
    readonly hasTrades: boolean
    readonly hasCandles: boolean
    readonly hasLevel2Snapshots: boolean
    readonly hasLevel2Updates: boolean
    readonly hasLevel3Snapshots: boolean
    readonly hasLevel3Updates: boolean
    close(): void
    reconnect(): void
    subscribeTicker(market: Market): boolean
    unsubscribeTicker(market: Market): void
    subscribeTrades(market: Market): boolean
    unsubscribeTrades(market: Market): void
    subscribeCandles(market: Market): boolean
    unsubscribeCandles(market: Market): void
    subscribeLevel2Snapshots(market: Market): boolean
    unsubscribeLevel2Snapshots(market: Market): void
    subscribeLevel2Updates(market: Market): boolean
    unsubscribeLevel2Updates(market: Market): void
    subscribeLevel3Snapshots(market: Market): boolean
    unsubscribeLevel3Snapshots(market: Market): void
    subscribeLevel3Updates(market: Market): boolean
    unsubscribeLevel3Updates(market: Market): void
    on(event: ErrorEvent, callback: ErrorEventCallback): void
    on(event: TradeEvent, callback: TradeEventCallback): void
    on(event: TickerEvent, callback: TickerEventCallback): void
    on(event: CandleEvent, callback: CandleEventCallback): void
    on(event: Level2SnapshotEvent, callback: Level2SnapshotCallback): void
    on(event: Level2UpdateEvent, callback: Level2UpdateCallback): void
    on(event: Level3SnapshotEvent, callback: Level3SnapshotCallback): void
    on(event: Level3UpdateEvent, callback: Level3UpdateCallback): void
    on(event: ConnectionEvent, callback: ConnectionEventCallback): void
}

export interface ExchangeClientConstructor {
    new (params?: any): ExchangeClient;
}

export interface MultiClient {
    bibox: ExchangeClientConstructor
    binance: ExchangeClientConstructor
    binanceje: ExchangeClientConstructor
    binanceus: ExchangeClientConstructor
    bitfinex: ExchangeClientConstructor
    bitflyer: ExchangeClientConstructor
    bitmex: ExchangeClientConstructor
    bitstamp: ExchangeClientConstructor
    bittrex: ExchangeClientConstructor
    cex: ExchangeClientConstructor
    coinbasepro: ExchangeClientConstructor
    coinex: ExchangeClientConstructor
    ethfinex: ExchangeClientConstructor
    ftx: ExchangeClientConstructor
    gateio: ExchangeClientConstructor
    gemini: ExchangeClientConstructor
    hitbtc: ExchangeClientConstructor
    huobi: ExchangeClientConstructor
    kucoin: ExchangeClientConstructor
    kraken: ExchangeClientConstructor
    liquid: ExchangeClientConstructor
    okex: ExchangeClientConstructor
    poloniex: ExchangeClientConstructor
    upbit: ExchangeClientConstructor
    zb: ExchangeClientConstructor
}

export interface Ticker {
    exchange: string
    base: string
    quote: string
    timestamp: number
    last: string
    open: string
    low: string
    high: string
    volume: string
    quoteVolume: string
    change: string
    changePercent: string
    bid: string
    bidVolume: string
    ask: string
    askVolume: string
}

export interface Trade {
    exchange: string
    base: string
    quote: string
    tradeId: string
    unix: number
    side: 'buy'|'sell'
    price: string
    amount: string
    buyOrderId: string
    sellOrderId: string
}

export interface Candle {
    timestampMs: number
    open: string
    high: string
    low: string
    close: string
    volume: string
}

export interface Level2Point {
    price: string
    size: string
    count: number
}

export interface Level2Snapshot {
    exchange: string
    base: string
    quote: string
    timestampMs: number
    sequenceId: number
    asks: Level2Point[]
    bids: Level2Point[]
}

export interface Level2Update {
    exchange: string
    base: string
    quote: string
    timestampMs: number
    sequenceId: number
    asks: Level2Point[]
    bids: Level2Point[]
}

export interface Level3Point {
    orderId: string
    price: string
    size: string
    meta: any
}

export interface Level3Snapshot {
    exchange: string
    base: string
    quote: string
    timestampMs: number
    sequenceId: number
    asks: Level3Point[]
    bids: Level3Point[]
}

export interface Level3Update {
    exchange: string
    base: string
    quote: string
    timestampMs: number
    sequenceId: number
    asks: Level3Point[]
    bids: Level3Point[]
}

export interface ErrorEventCallback { 
    (error: Error): void
}

export interface TradeEventCallback { 
    (trade: Trade, market: Market): void
}

export interface TickerEventCallback { 
    (ticker: Ticker, market: Market): void
}

export interface CandleEventCallback { 
    (candle: Candle, market: Market): void
}

export interface Level2SnapshotCallback {
    (l2snapshot: Level2Snapshot, market: Market): void
}

export interface Level2UpdateCallback {
    (l2update: Level2Update, market: Market): void
}

export interface Level3SnapshotCallback {
    (l3snapshot: Level3Snapshot, market: Market): void
}

export interface Level3UpdateCallback {
    (l3update: Level3Update, market: Market): void
}

export interface ConnectionEventCallback { 
    (): void
}

type ConnectionEvent = 'connecting'|'connected'|'disconnected'|'closing'|'closed'|'reconnecting'
type ErrorEvent = 'error'
type TickerEvent = 'ticker'
type TradeEvent = 'trade'
type CandleEvent = 'candle'
type Level2SnapshotEvent = 'l2snapshot'
type Level2UpdateEvent = 'l2update'
type Level3SnapshotEvent = 'l3snapshot'
type Level3UpdateEvent = 'l3update'

export interface TickerPayload {
    ticker: Ticker
    market: Market
}

export interface Level2SnapshotPayload {
    l2snapshot: Level2Snapshot
    market: Market
}

export interface Level2UpdatePayload {
    l2update: Level2Update
    market: Market
}

export interface OrderbookUpdatePayload { 
    symbol: string
    sequence: number
    asks: Order[]
    bids: Order[]
}
