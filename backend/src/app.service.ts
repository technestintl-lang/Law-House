import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth(): { status: string; version: string } {
    return {
      status: 'ok',
      version: this.configService.get('npm_package_version', '0.1.0'),
    };
  }
}

