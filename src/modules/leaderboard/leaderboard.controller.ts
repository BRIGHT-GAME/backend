import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.sevice';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Leaderboard')
@Controller('/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('top')
  @ApiOperation({ summary: 'Get top leaderboard players' })
  @ApiResponse({ status: 200, description: 'List of top players' })
  getTop() {
    return this.leaderboardService.getTopPlayers();
  }
}