import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MattersService } from './matters.service';
import { MattersController } from './matters.controller';
import { Matter } from './matter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Matter])],
  providers: [MattersService],
  controllers: [MattersController],
  exports: [MattersService],
})
export class MattersModule {}

