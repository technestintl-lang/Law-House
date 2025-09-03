import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Create HTTPS options for production
  let httpsOptions = undefined;
  if (isProduction && fs.existsSync('/etc/ssl/certs/legisflow.pem') && fs.existsSync('/etc/ssl/private/legisflow.key')) {
    httpsOptions = {
      key: fs.readFileSync('/etc/ssl/private/legisflow.key'),
      cert: fs.readFileSync('/etc/ssl/certs/legisflow.pem'),
    };
    logger.log('HTTPS enabled with SSL certificates');
  }
  
  // Create application with appropriate options
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: isProduction ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(ConfigService);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS with production settings
  const corsOrigin = configService.get('CORS_ORIGIN', '*');
  logger.log(`CORS configured with origin: ${corsOrigin}`);
  
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    maxAge: 3600,
  });
  
  // Enhanced security for production
  app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction,
    crossOriginOpenerPolicy: isProduction,
    crossOriginResourcePolicy: isProduction ? { policy: 'same-origin' } : false,
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }));
  
  // Compression
  app.use(compression({
    threshold: 1024, // Only compress responses larger than 1KB
    level: 6, // Compression level (0-9, where 9 is best compression but slowest)
  }));
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: isProduction, // Hide detailed error messages in production
    }),
  );
  
  // Swagger documentation - only in non-production environments
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('LegisFlow CEMAC API')
      .setDescription('Legal Practice Management API for CEMAC Region')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger documentation enabled at /api/docs');
  }
  
  // Start server
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  logger.log(`Application is running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
  logger.log(`Server listening on ${isProduction ? 'https' : 'http'}://localhost:${port}`);
}
bootstrap();
