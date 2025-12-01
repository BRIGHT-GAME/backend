import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { LeaderboardPlayerDto } from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getTopPlayers(limit = 100) : Promise<LeaderboardPlayerDto[]> {
    const users = await this.userRepository.find({
      order: { level: 'DESC' },
      take: limit,
      select: ['username', 'level', 'gameCoins', 'id'],
    });

    return users.map((user) => ({
        id: user.id,
        rank: user.level,
        username: user.username, 
        score: this.formatScore(user.gameCoins),
    }));
  }

  private formatScore(score: number): string {
    if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
    if (score >= 1_000) return `${(score / 1_000).toFixed(1)}K`;
    return `${score}`;
  }
}