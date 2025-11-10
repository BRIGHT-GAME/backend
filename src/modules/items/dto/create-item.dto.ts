import { ApiProperty } from '@nestjs/swagger';
import {IItem} from "../interfaces/IItem";

export class CreateItemDto implements IItem{
  @ApiProperty({
    description: 'Название айтема (скина)',
    example: '_skinBlue',
  })
  name: string;

  @ApiProperty({
    description: 'Описание айтема',
    example: 'Синий скин для персонажа',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL изображения айтема',
    example: 'http://example.com/skin-blue.png',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Цена айтема',
    example: 100,
    default: 0,
  })
  price: number;
}
