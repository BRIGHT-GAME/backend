import { Controller, Post, Body } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemEntity } from './entity/item.entity';
import {ApiTags, ApiResponse, ApiOperation} from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый айтем' })
  @ApiResponse({ status: 201, description: 'Айтем успешно создан', type: ItemEntity })
  async createItem(@Body() createItemDto: CreateItemDto): Promise<ItemEntity> {
    return this.itemsService.createItem(createItemDto);
  }
}
