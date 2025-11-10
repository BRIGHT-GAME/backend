import { ApiProperty } from '@nestjs/swagger';

export class UpdateScoreDto {
  @ApiProperty({
    description: 'Количество заработанных гемов',
    example: 10,
  })
  newGem: number;
@ApiProperty({
  description: 'уровень, который прошел пользователь',
  example: 2,
})
  level: number;

  @ApiProperty({
    description: 'Номер индекса заготовки',
    example: 2,
  })
  levelInd: number;
}
