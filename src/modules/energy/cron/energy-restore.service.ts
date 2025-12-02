// energy-restore.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../../users/user.service';
import {EnergyCacheService} from "../../cash/energy-cache.service";
import { Logger } from '@nestjs/common';

@Injectable()
export class EnergyRestoreService {
  private readonly logger = new Logger(EnergyRestoreService.name);

  constructor(
    private readonly energyCacheService: EnergyCacheService,
    private readonly userService: UserService,
  ) {}

  // Крон, запускающийся раз в 5 минут (пример)
  @Cron(CronExpression.EVERY_5_MINUTES)
  async restoreEnergy() {
    this.logger.log('🔄 Начинаем проверку восстановления энергии...');
    const userIds = this.energyCacheService.getAllUserIds();

    for (const userId of userIds) {
      const cacheData = this.energyCacheService.getUserCache(userId);
      if (!cacheData) continue;

      // Получаем актуальные данные из БД (currentEnergy, maxEnergy)
      const user = await this.userService.getUser(userId);

      // Для каждого spentTime проверяем, прошло ли 16 минут (ускорено в 30 раз)
      const now = new Date();
      const sixteenMinutes = (8 * 60 * 60 * 1000) / 30; // 8 часов / 30 = 16 минут

      let updated = false;
      const newSpentTimes = [];

      for (const spentTime of cacheData.spentTimes) {
        const diff = now.getTime() - spentTime.getTime();
        if (diff >= sixteenMinutes) {
          // Прошло 16 минут, восстанавливаем 1 энергию
          if (user.energyCurrent < user.energyMax) {
            user.energyCurrent++;
            updated = true;
          }
          // Если energyCurrent == energyMax, мы не накапливаем сверх лимита
          // значит не добавляем spentTime в newSpentTimes
        } else {
          // Ещё не прошло 16 минут, сохраняем запись
          newSpentTimes.push(spentTime);
        }
      }

      // Если было восстановление, сохраняем изменения в БД
      if (updated) {
        // Проверяем, не превышаем ли maxEnergy (учитывая, что maxEnergy может уменьшиться)
        if (user.energyCurrent > user.energyMax) {
          user.energyCurrent = user.energyMax;
        }
        await this.userService.saveUser(user);
      }

      // Если после очистки массив пустой ИЛИ user.energyCurrent == maxEnergy
      // то можно убрать пользователя из кэша
      if (newSpentTimes.length === 0 || user.energyCurrent === user.energyMax) {
        this.energyCacheService.removeUser(userId);
      } else {
        // Иначе обновляем массив spentTimes
        this.energyCacheService.updateUserCache(userId, { spentTimes: newSpentTimes, currentEnergy: user.energyCurrent });
      }
    }

    this.logger.log('✅ Завершили проверку восстановления энергии.');
  }
}
