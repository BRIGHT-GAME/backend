import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GameStartResponseDto {
  @ApiProperty({
    description: 'Флаг успешного начала игры (true, если игра запущена, false, если недостаточно энергии)',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Обновлённые данные пользователя',
    type: UserDto,
    nullable: true,
  })
  user: UserDto | null;
}
