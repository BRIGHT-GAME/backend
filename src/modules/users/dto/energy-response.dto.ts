import { ApiProperty } from '@nestjs/swagger';

export class EnergyResponseDto {
  @ApiProperty({ description: 'Текущая энергия пользователя', example: 5 })
  energyCurrent: number;

  @ApiProperty({ description: 'Максимальная энергия пользователя', example: 10 })
  energyMax: number;
}
