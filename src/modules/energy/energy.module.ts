import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import {EnergyRestoreService} from "./cron/energy-restore.service";
import {EnergyCacheModule} from "../cash/energy-cash.module";
import {UserModule} from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ]),
    ScheduleModule.forRoot(),
    EnergyCacheModule,
    UserModule
  ],
  providers: [
    //EnergySyncService,
    EnergyRestoreService
  ],
  exports: [],
})
export class EnergyModule {}
