import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {EnergyCacheModule} from "../cash/energy-cash.module";
import {ItemsModule} from "../items/items.module";
import {InventoryEntity} from "../inventory/entity/inventory.entity";
import { JwtProviderModule } from '../jwt/jwt.module';
import { TokenService } from '../token/token.service';
import { UserTasksEntity } from './entity/user-tasks.entity';
import { CoinHistoryEntity } from './entity/coin-history.entity';
import { CaseHistoryEntity } from './entity/case-history.entity';
import { EnergyHistoryEntity } from './entity/energy-history.entity';
import { GameHistoryEntity } from './entity/game-history.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      InventoryEntity,
      UserTasksEntity,
      CoinHistoryEntity,
      CaseHistoryEntity,
      EnergyHistoryEntity,
      GameHistoryEntity,
    ]), 
    JwtProviderModule,
    EnergyCacheModule,
    ItemsModule,
    forwardRef(() => TaskModule),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService],
})
export class UserModule {}
