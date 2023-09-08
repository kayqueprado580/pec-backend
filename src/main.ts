import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

// import { PrismaService } from './database/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Configuração do CORS para permitir "localhost"
  const configService = app.get(ConfigService);
  // const allowedOrigins: string[] = [configService.get('ALLOWED_ORIGIN', 'http://localhost:3000')];
  const corsOptions: CorsOptions = {
    origin: true,
    // origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

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
