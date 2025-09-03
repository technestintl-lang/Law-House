import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { MattersModule } from './matters/matters.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      cache: true,
      expandVariables: true,
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const logger = new Logger('TypeORM');
        
        logger.log(`Database connection configured for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'legisflow'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
          logging: configService.get('DB_LOGGING', 'false') === 'true',
          ssl: configService.get('DB_SSL', 'false') === 'true' ? {
            rejectUnauthorized: false,
          } : false,
          // Production optimizations
          ...(isProduction ? {
            poolSize: 20,
            maxQueryExecutionTime: 1000, // Log queries taking more than 1 second
            cache: true,
            migrationsRun: true,
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            cli: {
              migrationsDir: 'src/migrations',
            },
          } : {}),
        };
      },
    }),
    
    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          ttl: configService.get('THROTTLE_TTL', 60),
          limit: isProduction 
            ? configService.get('THROTTLE_LIMIT', 10) 
            : 1000, // Higher limit in development
        };
      },
    }),
    
    // Caching
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        if (isProduction && configService.get('REDIS_HOST')) {
          return {
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT', 6379),
            password: configService.get('REDIS_PASSWORD', ''),
            ttl: 60, // seconds
            max: 100, // maximum number of items in cache
          };
        }
        
        // In-memory cache for development
        return {
          ttl: 5, // seconds
          max: 100,
        };
      },
    }),
    
    // Scheduling for background tasks
    ScheduleModule.forRoot(),
    
    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
      serveStaticOptions: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      },
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    ClientsModule,
    MattersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
