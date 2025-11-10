// energy-cache.service.ts
import { Injectable } from '@nestjs/common';

interface UserEnergyCache {
  // список моментов, когда пользователь потратил энергию
  spentTimes: Date[];
  // текущее значение энергии (можно хранить здесь же,
  // либо хранить в БД и брать при восстановлении)
  currentEnergy: number;
}

@Injectable()
export class EnergyCacheService {
  private cache = new Map<number, UserEnergyCache>();

  // Когда пользователь тратит энергию, мы добавляем отметку времени
  addSpentEnergy(userId: number, currentEnergy: number) {
    const existing = this.cache.get(userId);
    if (!existing) {
      this.cache.set(userId, {
        spentTimes: [new Date()],
        currentEnergy,
      });
    } else {
      existing.spentTimes.push(new Date());
      existing.currentEnergy = currentEnergy;
    }
  }

  // Получаем данные о пользователе в кэше
  getUserCache(userId: number): UserEnergyCache | undefined {
    return this.cache.get(userId);
  }



  // Обновляем currentEnergy и массив spentTimes
  updateUserCache(userId: number, data: Partial<UserEnergyCache>) {
    const existing = this.cache.get(userId);
    if (!existing) return;
    this.cache.set(userId, { ...existing, ...data });
  }

  // Удаляем пользователя из кэша, если энергия полная
  removeUser(userId: number) {
    this.cache.delete(userId);
  }

  // Получаем всех пользователей, у кого есть записи
  getAllUserIds(): number[] {
    return Array.from(this.cache.keys());
  }
}
