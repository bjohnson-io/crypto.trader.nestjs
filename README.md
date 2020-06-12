## Description

An example/starter app for a crypto tradining bot I used for a YouTube video and blog post.  I've done my best to be extremely verbose with the comments in the hopes that it is easy to follow along.  In case you're new to NestJS, you'll want to start in the main.ts file.

## Getting Started

```bash
> git clone https://github.com/bjohnson-io/crypto.trader.nestjs <PROJECT_DIR>
> cd <PROJECT_DIR>
> yarn && yarn start:dev
```

## Client App

I created a Nuxt app starter repo that works with this backend. Head over to that [repo](https://https://github.com/bjohnson-io/crypto.trader.nuxtjs) to download and install it.

## This is a work in progress!

While I won't put too much work into this--I would like for it to be a more generic starter--I do want to add in a few more things.

1. Pull ticker data in addition to the L2 orderbook data.
2. Store ticker data in a DB for historical queries.

This app is provided as opensource. For details, please see the [Apache 2.0 License](LICENSE).
