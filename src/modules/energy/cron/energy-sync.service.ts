// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import {Repository, UpdateResult} from 'typeorm';
// import { User } from '../users/entity/user.entity';
// import {UpdateBalanceService} from "./blockchain/update.balance.service";
//
// @Injectable()
// export class EnergySyncService {
//   constructor(
//     private readonly blockchainService: UpdateBalanceService,
//     @InjectRepository(User) private readonly userRepo: Repository<User>,
//   ) {}
//
//   @Cron(CronExpression.EVERY_30_MINUTES)
//   async syncEnergy() {
//     console.log('🔄 Запуск синхронизации энергии...');
//
//     const users = await this.userRepo.find();
//     const wallets = users.map(user => user.walletAddress);
//     if (wallets.length === 0) return;
//
//     const balances = await this.blockchainService.getTokenBalances(wallets);
//     const updates: Promise<UpdateResult>[] = [];
//
//     for (const user of users) {
//       const newMaxEnergy = balances[user.walletAddress] || 0;
//       if (newMaxEnergy !== user.energyMax) {
//         console.log(`🔹 Обновление энергии для ${user.walletAddress}: ${user.energyMax} → ${newMaxEnergy}`);
//
//         const spentEnergy = user.energyMax - user.energyCurrent;
//         const newEnergyCurrent = Math.max(0, newMaxEnergy - spentEnergy);
//
//         updates.push(
//           this.userRepo
//             .createQueryBuilder()
//             .update(User)
//             .set({ energyMax: newMaxEnergy, energyCurrent: newEnergyCurrent })
//             .where('id = :id', { id: user.id })
//             .execute()
//         );
//       }
//     }
//
//     await Promise.all(updates);
//     console.log('✅ Энергия синхронизирована.');
//   }
// }
