import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const contentLength = response.get('content-length') || 0;
          const responseTime = Date.now() - startTime;

          // In production, only log basic info and errors
          if (this.isProduction) {
            if (statusCode >= 400) {
              this.logger.error(
                `${method} ${url} ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`,
              );
            } else {
              this.logger.log(
                `${method} ${url} ${statusCode} - ${responseTime}ms`,
              );
            }
          } else {
            // In development, log more details
            this.logger.log(
              `${method} ${url} ${statusCode} - ${responseTime}ms - ${contentLength} bytes - ${ip} - ${userAgent}`,
            );
          }
        },
        error: (error) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode || 500;
          const responseTime = Date.now() - startTime;

          this.logger.error(
            `${method} ${url} ${statusCode} - ${responseTime}ms - ${ip} - ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}

