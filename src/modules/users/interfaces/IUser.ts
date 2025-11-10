import {IInventory} from "../../inventory/interfaces/IInventory";

export interface IUser {
  id: number;
  walletAddress: string;
  username: string;

  // Текущее и максимальное количество энергии
  energyCurrent: number;
  energyMax: number;

  // Внутриигровые монеты
  gameCoins: number;

  // Очки (score)
  score: number;

  // Уровень и индикатор уровня
  level: number;
  levelInd: number;

  inventory?: IInventory[];
}
