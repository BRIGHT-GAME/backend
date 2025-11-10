import {Controller, Get, Post, Body, Param, ParseIntPipe, Query, Put, UseGuards, Request, UnauthorizedException} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserDto} from "./dto/user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import { UserResponseDto} from "./dto/response.dto";
import {EnergyResponseDto} from "./dto/energy-response.dto";
import {UpdateScoreDto} from "./dto/UpdateScoreDto";
import {GameStartResponseDto} from "./dto/game-start-response.dto";
import {EquipSkinDto} from "../inventory/dto/equip-skin.dto";
import {BuyItemDto} from "./dto/buy-item.dto";
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post("/register")
  // @ApiOperation({ summary: 'Регистрация нового пользователя' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Ответ с флагом успешности и сообщением',
  //   type: UserResponseDto,
  // })
  // async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
  //   const { walletAddress, username } = createUserDto;
  //   try {
  //     const user = await this.userService.createUser(walletAddress, username);
  //     return {
  //       success: true,
  //       message: 'Пользователь успешно создан',
  //       data: user,
  //     };
  //   } catch (error) {
  //     // Здесь можно обработать специфичные ошибки, например, конфликт по уникальному ключу
  //     return {
  //       success: false,
  //       message: error.message || 'Ошибка при создании пользователя',
  //       data: null,
  //     };
  //   }
  // }
//тест раннера
  // @Get(':id/getById')
  // @ApiOperation({ summary: 'Получить пользователя по id' })
  // @ApiResponse({ status: 200, description: 'Информация о пользователе', type: UserDto })
  // async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
  //   return this.userService.getUser(id);
  // }
  // @Get('/login/:wallet')
  // @ApiOperation({ summary: 'Авторизация пользователя через кошелек' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Информация о пользователе с флагом успешности и сообщением',
  //   type: UserResponseDto,
  // })
  // async getUserByWallet(@Param('wallet') wallet: string): Promise<UserResponseDto> {
  //   try {
  //     const user = await this.userService.getUserByWallet(wallet);
  //     return {
  //       success: true,
  //       message: 'Пользователь успешно найден',
  //       data: user,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.message || 'Пользователь не найден',
  //       data: null,
  //     };
  //   }
  // }

  @Get('/login')
  @ApiOperation({ summary: 'Авторизация пользователя через кошелек' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе с флагом успешности и сообщением',
    type: UserResponseDto,
  })
  async gameLogin(@Query('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }
  
    let user;
    try {
      user = this.userService.verifyToken(accessToken);
      const data = await this.userService.gameLogin(Number(user.sub), accessToken);
      return {
        success: true,
        message: 'Пользователь успешно найден',
        data,
      };
    } catch (error) {
      
      return {
        success: false,
        message: error.message || 'Invalid access token',
        sub: user.sub,
        data: null,
      };
    }
  }
  

  @Post(':id/update')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('game/token')
  @ApiOperation({ summary: 'Получить access token для запуска игры' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает временный access token для запуска игры',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async getGameToken(@Request() req: { user: { sub: number } }) {
    if (!req.user) {
      throw new UnauthorizedException('Access token is required');
    }

    const userId = req.user.sub;

    return this.userService.getGameToken(userId);
  }


  @Get(':wallet/energy')
  @ApiOperation({ summary: 'Получить энергию пользователя по кошельку' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает текущую и максимальную энергию пользователя',
    type: EnergyResponseDto,
  })
  async getEnergy(@Param('wallet') wallet: string): Promise<EnergyResponseDto> {
    return this.userService.getEnergy(wallet);
  }

  @Post(':wallet/gem')
  @ApiOperation({ summary: 'добавление гемов пользователю, обновление уровня, который он прошел, а так же id заготовки уровня' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает обновленного пользователя',
    type: UserDto,
  })
  async updateScore(
    @Param('wallet') wallet: string,
    @Body() body: UpdateScoreDto,
  ): Promise<UserDto> {
    return this.userService.updateScore(wallet, body);
  }

  @Get(':wallet/start')
  @ApiOperation({ summary: 'Начать игру, проверяя достаточность энергии' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает флаг успешного начала игры и обновленные данные пользователя.',
    type: GameStartResponseDto,
  })
  async startGame(@Param('wallet') wallet: string): Promise<GameStartResponseDto> {
    return this.userService.startGame(wallet);
  }

  @Put(':wallet/equip-skin')
  @ApiOperation({
    summary: 'Смена активного скина пользователя',
    description:
      'Обновляет активный скин пользователя, определяемый по кошельку. В теле запроса ожидается объект EquipSkinDto, содержащий имя скина, который должен быть надет. При успешном выполнении возвращаются обновлённые данные пользователя в виде UserResponseDto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Активный скин успешно изменён и возвращены обновлённые данные пользователя.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Ошибка при смене активного скина (например, указанный скин не найден в инвентаре или переданы некорректные данные).',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь с указанным кошельком не найден.',
  })
  async equipSkin(
    @Param('wallet') wallet: string,
    @Body() equipSkinDto: EquipSkinDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userService.equipSkin(wallet, equipSkinDto.name);
      return {
        success: true,
        message: 'Активный скин успешно изменён',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Ошибка при смене активного скина',
        data: null,
      };
    }
  }

  @Post(':wallet/buy-item')
  @ApiOperation({ summary: 'Купить айтем за игровые монеты' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает обновлённые данные пользователя после покупки айтема.',
    type: UserDto,
  })
  async buyItem(
    @Param('wallet') wallet: string,
    @Body() buyItemDto: BuyItemDto
  ): Promise<UserDto> {
    return this.userService.buyItem(wallet, buyItemDto.itemName);
  }

  @Post(':wallet/set-energy')
  @ApiOperation({ summary: 'Установить энергию пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает обновлённые данные пользователя после установки энергии.',
    type: UserDto,
  })
  async setEnergy(@Param('wallet') wallet: string): Promise<UserDto> {
    
    return this.userService.setEnergyAndCoins(wallet);
  } 

  @UseGuards(JwtAuthGuard)
  @Post('open-case')
  async getProfile(@Request() req: { user: { sub: number }}) {
    const userId = req.user.sub;
    return this.userService.openCase(userId);
  }


  @UseGuards(JwtAuthGuard)
  @Post('daily-case')
  @ApiOperation({ summary: 'Открыть ежедневный кейс' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает тип полученного кейса',
  })
  async dailyCase(@Request() req: { user: { sub: number }}) {
    const userId = req.user.sub;
    return this.userService.openDailyCase(userId);
  }
}
