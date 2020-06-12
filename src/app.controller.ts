import { Controller, Get } from '@nestjs/common';

/**
 * Currently not being used since we're communicating with
 * the client app via websockets. However, we'll probably
 * need to configure REST endpoints for login when
 * authentication is added.
 */
@Controller()
export class AppController {
  constructor() {}

  // @Get()
  // getHello(): string {
  //   return 'hello!';
  // }
}
