// equip-skin.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class EquipSkinDto {
  @ApiProperty({
    description: 'Название скина, который нужно экипировать',
    example: '_skinYellow',
  })
  name: string;
}
