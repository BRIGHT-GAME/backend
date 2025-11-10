import {BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from './entity/user.entity';
import {UpdateUserDto} from './dto/update-user.dto';
import {EnergyCacheService} from "../cash/energy-cache.service";
import {GameStartResponseDto} from "./dto/game-start-response.dto";
import {UpdateScoreDto} from "./dto/UpdateScoreDto";
import {UserDto} from "./dto/user.dto";
import {InventoryEntity} from "../inventory/entity/inventory.entity";
import {ItemsService} from "../items/items.service";
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { UserTasksEntity } from './entity/user-tasks.entity';
import { CoinHistoryEntity } from './entity/coin-history.entity';
import { CaseHistoryEntity, ECaseType } from './entity/case-history.entity';
import { EnergyHistoryEntity } from './entity/energy-history.entity';

const CASE_PRICE = 200;
const COINS_PER_TOKEN = 100;
const MAX_ENERGY = 500;

type TStartDiapason = number;
type TEndDiapason = number;


const CASE_CHANCES: Record<ECaseType, [TStartDiapason, TEndDiapason]> = {
  [ECaseType.energy_10]: [0, 0.3],
  [ECaseType.energy_30]: [0.31, 0.5],
  [ECaseType.energy_50]: [0.51, 0.7],
  [ECaseType.coins_100]: [0.71, 0.9],
  [ECaseType.coins_250]: [0.91, 0.98],
  [ECaseType.coins_500]: [0.981, 0.999],
  [ECaseType.gold_mask]: [0.9991, 1],
  [ECaseType.gold_mask_repeat]: [-1,-1],
}



@Injectable()
export class UserService {
  //TODO: установить id для предмета
  private goldMaskId: 10;

  private caseFunctions: Record<ECaseType, (userId: number, isDaily?: boolean) => Promise<void>> = {
    [ECaseType.gold_mask_repeat]: async () => {},
    [ECaseType.energy_10]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.energyCurrent += 10;
      const caseType = ECaseType.energy_10;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
    [ECaseType.energy_30]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.energyCurrent += 30;
      const caseType = ECaseType.energy_30;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
    [ECaseType.energy_50]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.energyCurrent += 50;
      const caseType = ECaseType.energy_50;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
    [ECaseType.coins_100]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.gameCoins += 100;
      const caseType = ECaseType.coins_100;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
    [ECaseType.coins_250]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.gameCoins += 250;
      const caseType = ECaseType.coins_250;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
      })
    },
    [ECaseType.coins_500]: async (userId: number, isDaily: boolean = false) => {
      const users = await this.userRepo.find({
        where: {
          id: userId,
        }
      })

      if (users.length === 0)
        return;

      const user = users[0];
      user.gameCoins += 500;
      const caseType = ECaseType.coins_500;
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
    [ECaseType.gold_mask]: async (userId: number, isDaily: boolean = false) => {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['inventory', 'inventory.item'],
      });

      if (!user) {
        return;
      }

      let caseType = ECaseType.gold_mask;
      let existingInventory = user.inventory.find(
        (inv) => inv.itemId === this.goldMaskId,
      );
      if (!existingInventory) {
        // Если не найдено, создаём новую запись
        const newInv = this.inventoryRepo.create({
          userId: user.id,
          itemId: this.goldMaskId,
        });
        await this.inventoryRepo.save(newInv);
      } else {
        user.gameCoins += 400;
        caseType= ECaseType.gold_mask_repeat  
      }
      await this.userRepo.save(user);
      await this.caseHistoryRepository.save({
        userId,
        caseType,
        isDaily,
      })
    },
  }

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
    private readonly itemService: ItemsService,
    private readonly jwtService: JwtService,
    private readonly energyService: EnergyCacheService,
    private readonly tokenService: TokenService,
    @InjectRepository(UserTasksEntity)
    private readonly userTaskRepo: Repository<UserTasksEntity>,
    @InjectRepository(CoinHistoryEntity)
    private readonly coinHistoryRepository: Repository<CoinHistoryEntity>,
    @InjectRepository(CaseHistoryEntity)
    private readonly caseHistoryRepository: Repository<CaseHistoryEntity>,
    @InjectRepository(EnergyHistoryEntity)
    private readonly energyHistoryRepository: Repository<EnergyHistoryEntity>,
  ) {}


  async createUser(walletAddress: string, username: string): Promise<UserEntity> {
    const existingByWallet = await this.userRepo.findOne({ where: { walletAddress } });
    if (existingByWallet) {
      throw new ConflictException(`Пользователь с кошельком ${walletAddress} уже существует.`);
    }
    const existingByUsername = await this.userRepo.findOne({ where: { username } });
    if (existingByUsername) {
      throw new ConflictException(`Пользователь с именем ${username} уже существует.`);
    }
    const user = await this.userRepo.save({ walletAddress, username});
    const inventory = await this.inventoryRepo.save({userId: user.id, itemId: 1});
    user.inventory = [inventory]
    return this.userRepo.save(user);
  }
  async findByWallet(walletAddress: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { walletAddress } });
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async getUserByWallet(wallet: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { walletAddress: wallet },
      relations: ['inventory', 'inventory.item','equippedSkin'] // загружаем инвентарь и связанные предметы
    });
    if (!user) {
      throw new NotFoundException(`User with wallet ${wallet} not found`);
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.getUser(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepo.save(user);
  }

  // Получаем текущую и максимальную энергию (если хотим пересчитывать на лету – пример)
  async getEnergy(wallet: string): Promise<{ energyCurrent: number; energyMax: number }> {
    const user = await this.userRepo.findOne({ where: { walletAddress:wallet } });
    return { energyCurrent: user.energyCurrent, energyMax: user.energyMax };
  }

  // Обновляем счёт (очки)
  async updateScore(wallet: string, data: UpdateScoreDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { walletAddress:wallet } });
    if (!user) {
      throw new NotFoundException(`Пользователь с кошельком ${wallet} не найден`);
    }
    user.gameCoins = data.newGem;
    user.level = data.level;
    user.levelInd = data.levelInd;
    
    return this.userRepo.save(user);
  }

  async startGame(wallet: string): Promise<GameStartResponseDto> {
    const user = await this.userRepo.findOne({
      where: { walletAddress: wallet },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с кошельком ${wallet} не найден`);
    }

    if (user.energyCurrent >= 1) {
      // Регистрируем трату энергии в кэше
      this.energyService.addSpentEnergy(user.id, user.energyCurrent);
      // Уменьшаем энергию
      user.energyCurrent--;
      const updatedUser = await this.userRepo.save(user);
      return { success: true, user: updatedUser };
    }
    return { success: false, user: user };
  }

  async equipSkin(wallet: string, skinName: string): Promise<UserDto> {
    // Получаем пользователя с инвентарем и экипированным скином
    const user = await this.userRepo.findOne({
      where: { walletAddress: wallet },
      relations: ['inventory', 'inventory.item', 'equippedSkin'],
    });

    if (!user) {
      throw new NotFoundException(`User with wallet ${wallet} not found`);
    }

    // Проверяем, что скин присутствует в инвентаре пользователя.
    // Так как дефолтный скин уже добавлен в инвентарь при создании,
    // пользователь всегда имеет хотя бы один скин.
    const inventorySkin = user.inventory.find(inv => inv.item && inv.item.name === skinName);
    if (!inventorySkin) {
      throw new BadRequestException(`Скин с названием "${skinName}" не найден в инвентаре пользователя`);
    }

    // Обновляем активный скин: всегда может быть надет только один.
    user.equippedSkin = inventorySkin.item

    return this.userRepo.save(user);
  }

  async buyItem(wallet: string, itemName: string): Promise<UserDto> {
    // 1) Получаем пользователя
    const user = await this.userRepo.findOne({
      where: { walletAddress: wallet },
      relations: ['inventory', 'inventory.item'],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с кошельком ${wallet} не найден`);
    }

    // 2) Находим айтем по имени
    const item = await this.itemService.findByName(itemName);
    if (!item) {
      throw new NotFoundException(`Айтем с именем "${itemName}" не найден`);
    }

    // 3) Проверяем достаточность gameCoins
    if (user.gameCoins < item.price) {
      throw new BadRequestException(
        `Недостаточно игровых монет. Нужно ${item.price}, а у пользователя ${user.gameCoins}`
      );
    }

    // 4) Проверяем, есть ли уже такая запись в инвентаре
    let existingInventory = user.inventory.find(
      (inv) => inv.itemId === item.id
    );
    if (!existingInventory) {
      // Если не найдено, создаём новую запись
      const newInv = this.inventoryRepo.create({
        userId: user.id,
        itemId: item.id,
      });
      await this.inventoryRepo.save(newInv);
    } else {
        throw new ConflictException(`Пользователь уже имеет айтем "${itemName}"`);
    }

    // 5) Списываем стоимость айтема
    user.gameCoins -= item.price;
    await this.userRepo.update(user.id,{gameCoins: user.gameCoins});

    // 6) Возвращаем обновлённые данные пользователя в формате DTO
    return await this.userRepo.findOne({
      where: {id: user.id},
      relations: ['inventory', 'inventory.item', 'equippedSkin'],
    });
  }


  async updateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
  
    const user = await this.findByWallet(walletAddress);
    if (user) {
      user.nonce = nonce;
      await this.saveUser(user);
    } else {
      throw new NotFoundException('User not found');
    }
  
    return nonce;
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async getGameToken(userId: number): Promise<string> {
    const user = await this.userRepo.findOneBy({ id: userId })
    if (!user) throw new UnauthorizedException('User not found');
  
    const payload = {
      sub: user.id,
    };
  
    const gameToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d' // TODO: Fix that & Remove it
    });
  
    return gameToken;
  }

  async gameLogin(userId: number, accessToken: string): Promise<any> {

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['inventory', 'inventory.item', 'equippedSkin']
    });

    if (!user) {
      throw new UnauthorizedException("The user doesn't exist");
    }

    return {
      accessToken,
      user,
    }
  }

  verifyToken(token: string,): { sub: string; walletAddress: string } | null {
    return this.jwtService.verify(token); 
  }

  private getEnergyForSolBalance(solBalance: number): number {
    if (solBalance >= 1) {
      return 120;
    } else if (solBalance >= 0.1) {
      return 80;
    } else if (solBalance >= 0.01) {
      return 40;
    } else {
      return 2;
    }
  }

  async setEnergyAndCoins(wallet: string): Promise<UserDto> {
    const tokenBalance = await this.tokenService.getTokenBalance(wallet);
    const solBalance = await this.tokenService.getSolBalance(wallet);
    console.log('Token balance:', tokenBalance, 'SOL balance:', solBalance);
    const user = await this.userRepo.findOne({ where: { walletAddress: wallet } });

    if (!user) {
      throw new NotFoundException(`Пользователь с кошельком ${wallet} не найден`);
    }
   
    const coinsRow = await this.getLastCoinHistory(user.id);
    if (coinsRow) {
      const { balance, createdAt } = coinsRow;
      if (balance < tokenBalance) {
        user.gameCoins += Math.floor(tokenBalance - balance) * COINS_PER_TOKEN;
        await this.coinHistoryRepository.save({
          userId: user.id,
          balance: tokenBalance,
        })
      } else {
        const now = new Date().getTime();
        const month = 30 * 24 * 60 * 60 * 1000;
        if ((balance !== tokenBalance) && createdAt.getTime() + month < now) {
          await this.coinHistoryRepository.save({
            userId: user.id,
            balance: tokenBalance,
          })
        }
      }
    }

    const energyFromBalance = this.getEnergyForSolBalance(solBalance);

    const energyFromTasks = await this.userTaskRepo.find({ where: { userId: user.id, completed: true }, relations: ['task'] });
    const totalEnergy = energyFromTasks.reduce((acc, item) => acc + item.task?.value, 0);

    const energyMax = energyFromBalance + totalEnergy;

    const energyRow = await this.getLastEnergyHistory(user.id);
    if (energyRow) {
      const { solBalance: lastSolBalance, createdAt } = energyRow;
      if (lastSolBalance < solBalance) {
        const oldEnergyFromBalance = this.getEnergyForSolBalance(lastSolBalance);
        const energyIncrease = energyFromBalance - oldEnergyFromBalance;
        if (energyIncrease > 0) {
          user.energyCurrent = Math.min(user.energyCurrent + energyIncrease, MAX_ENERGY);
        }
        await this.energyHistoryRepository.save({
          userId: user.id,
          solBalance: solBalance,
        })
      } else {
        const now = new Date().getTime();
        const month = 30 * 24 * 60 * 60 * 1000;
        if ((lastSolBalance !== solBalance) && createdAt.getTime() + month < now) {
          await this.energyHistoryRepository.save({
            userId: user.id,
            solBalance: solBalance,
          })
        }
      }
    } else {
      await this.energyHistoryRepository.save({
        userId: user.id,
        solBalance: solBalance,
      })
      user.energyCurrent = Math.min(energyMax, MAX_ENERGY);
    }

    if (user.energyMax > energyMax) {
      const { energyCurrent, energyMax: oldEnergyMax } = user
      const additionalEnergy = energyCurrent > energyMax ?  energyCurrent - energyMax : 0;
      const currentEnergy = energyMax + additionalEnergy
      user.energyCurrent = currentEnergy > MAX_ENERGY ? MAX_ENERGY : currentEnergy;
    }
    user.energyMax = energyMax;
    return this.userRepo.save(user);
  }

  async getLastCoinHistory(userId: number): Promise<CoinHistoryEntity | null> {
    try {
      const result = await this.coinHistoryRepository.find({
        where: {
          userId
        },
        take: 1,
        order: {
          createdAt: 'DESC'
        }
      });

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      return null;
    }
  }

  async getLastEnergyHistory(userId: number): Promise<EnergyHistoryEntity | null> {
    try {
      const result = await this.energyHistoryRepository.find({
        where: {
          userId
        },
        take: 1,
        order: {
          createdAt: 'DESC'
        }
      });

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      return null;
    }
  }


  async openCase(userId: number): Promise<ECaseType | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Пользователь с идентификатором ${userId} не найден`);
    }

    if (user.gameCoins < CASE_PRICE) {
      throw new BadRequestException(`У пользователя недостаточно монет, необходимо ${CASE_PRICE}`);
    }

    const coef = Math.random();
    let caseType: ECaseType;

    for (const key of Object.values(ECaseType)) {
      const [ bottom, top ] = CASE_CHANCES[key];
      if (coef >= bottom && coef <= top) {
        caseType = key as ECaseType;
        break;
      }
    }

    if (!caseType) {
      throw new InternalServerErrorException(`Произошла неизвестная ошибка при вычислении кейса`)
    }

    await this.caseFunctions[caseType](user.id);
    user.gameCoins -= CASE_PRICE;
    await this.userRepo.save(user);
    
    return caseType;
  }

  async openDailyCase(userId: number): Promise<ECaseType | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Пользователь с идентификатором ${userId} не найден`);
    }

    if (user.gameCoins < CASE_PRICE) {
      throw new BadRequestException(`У пользователя недостаточно монет, необходимо ${CASE_PRICE}`);
    }

    const lastDailyCase = await this.caseHistoryRepository.findOne({ where: { userId, isDaily: true }, order: { createdAt: 'DESC' } });
    if (lastDailyCase) {
      const now = new Date().getTime();
      const day = 24 * 60 * 60 * 1000;
      if (lastDailyCase.createdAt.getTime() + day > now) {
        throw new BadRequestException(`Ежедневный кейс уже открыт`);
      }
    }

    const coef = Math.random();
    let caseType: ECaseType;

    for (const key of Object.values(ECaseType)) {
      const [ bottom, top ] = CASE_CHANCES[key];
      if (coef >= bottom && coef <= top) {
        caseType = key as ECaseType;
        break;
      }
    }

    if (!caseType) {
      throw new InternalServerErrorException(`Произошла неизвестная ошибка при вычислении кейса`)
    }

    await this.caseFunctions[caseType](user.id, true);
    return caseType;
  }
}
