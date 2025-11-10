// src/users/dto/buy-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BuyItemDto {
  @ApiProperty({
    description: 'Имя айтема (скина), который покупается',
    example: 'skinBlue',
  })
  itemName: string;
}
