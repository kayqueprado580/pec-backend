import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { PrismaService } from './database/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());

  // const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.PORT || 3333, () => {
    console.log(`DOOR: ${process.env.PORT || 3333}`)
    console.log('HTTP server running...')
  })
}
bootstrap();
