import { ApiProperty } from '@nestjs/swagger';
import {IUser} from "../interfaces/IUser";
import {InventoryEntity} from "../../inventory/entity/inventory.entity";
import {ItemEntity} from "../../items/entity/item.entity";

export class UserDto implements IUser{
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Адрес криптокошелька пользователя',
    example: '0x123456789abcdef123456789abcdef123456789a',
  })
  walletAddress: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'CryptoMaster',
  })
  username: string;

  @ApiProperty({
    description: 'Текущая энергия пользователя',
    example: 50,
  })
  energyCurrent: number;

  @ApiProperty({
    description: 'Максимальная энергия пользователя',
    example: 100,
  })
  energyMax: number;

  @ApiProperty({
    description: 'Количество игровых монет пользователя',
    example: 10,
  })
  gameCoins: number;

  @ApiProperty({
    description: 'Очки пользователя для лидерборда',
    example: 200,
  })
  score: number;

  @ApiProperty({
    description: 'Уровень, который прошел пользователь',
    example: 2,
  })
  level: number;
  @ApiProperty({
    description: 'Номер индекса заготовки',
    example: 2,
  })
  levelInd: number;

  @ApiProperty({
    description: 'Инвентарь пользователя (объекты инвентаря)',
    type: [Object],
  })
  inventory: InventoryEntity[];

  @ApiProperty({
    description: 'Экипированный скин пользователя',
    type: () => ItemEntity,
    nullable: true,
    example: {
      id: 1,
      name: 'defaultSkin',
      description: 'Дефолтный скин',
      imageUrl: 'http://example.com/default-skin.png',
      price: 0
    },
  })
  equippedSkin?: ItemEntity;

  @ApiProperty({
    description: 'Количество сыгранных игр',
    example: 42,
  })
  gamesCount?: number;
}
