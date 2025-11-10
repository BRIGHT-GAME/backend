import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.sevice';
import { UserEntity } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderBoardModule {}
