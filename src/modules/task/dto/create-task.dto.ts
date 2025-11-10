import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Заголовок задания',
    example: 'Подпишись на Telegram-канал проекта',
  })
  title: string;

  @ApiProperty({
    description: 'Описание задания',
    example: 'Необходимо подписаться на официальный канал проекта в Telegram.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Ссылка, по которой выполняется задание (опционально)',
    example: 'https://t.me/projectchannel',
    required: false,
  })
  link?: string;

  @ApiProperty({
    description: 'Тип/условие задания (например, "telegram-subscription")',
    example: 'telegram-subscription',
  })
  condition: string;

  @ApiProperty({
    description: 'Ценность задания (награда, очки, энергия и т.п.)',
    example: 20,
  })
  value: number;
}