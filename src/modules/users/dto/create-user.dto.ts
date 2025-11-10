import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Адрес криптокошелька пользователя',
    example: '0x123456789abcdef123456789abcdef123456789a',
  })
  walletAddress: string;

  @ApiProperty({
    description: 'Выбранное имя пользователя',
    example: 'CryptoMaster',
  })
  username: string;
}
