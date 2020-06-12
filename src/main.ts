import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * This is where our app begins!
 */
async function bootstrap() {
  // This line loads the app.module file & bootstraps the server
  const app = await NestFactory.create(AppModule);
  // This line tells Nest what port to listen on
  await app.listen(80);
}
// Here's where we execute the bootstrap function we just
// defined above.
bootstrap();
