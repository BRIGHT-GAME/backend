import {  Module } from '@nestjs/common';
import { EnergyCacheService } from './energy-cache.service';
@Module({
  providers: [EnergyCacheService],
  exports: [EnergyCacheService],
})
export class EnergyCacheModule {}
