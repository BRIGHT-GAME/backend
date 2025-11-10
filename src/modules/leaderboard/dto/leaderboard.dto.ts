import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardPlayerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  score: string;

  @ApiProperty()
  rank: number;
}