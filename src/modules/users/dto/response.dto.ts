import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

// Generic base class
export class ResponseDto<T> {
  @ApiProperty({ description: 'Флаг успешности операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'Сообщение об операции', example: 'Пользователь успешно создан' })
  message: string;

  @ApiProperty({ 
    description: 'Данные ответа', 
    nullable: true 
  })
  data: T | null;
}

export class UserResponseDto extends ResponseDto<UserDto> {
  @ApiProperty({ 
    description: 'Данные ответа', 
    nullable: true,
    example: {
      id: 1,
      username: "John Doe",
      walletAddress: "0x1234567890abcdef",
      energyCurrent: 100,
      energyMax: 100,
      gameCoins: 10,
      score: 100,
      level: 2,
      levelInd: 3,
    }
  })
  declare data: UserDto | null;
}
