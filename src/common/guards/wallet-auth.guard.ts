import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import {UserService} from "../../modules/users/user.service";
import { WalletAuthService } from 'src/modules/wallet/wallet.service';
 // сервис для проверки подписи

@Injectable()
export class WalletAuthGuard implements CanActivate {
  constructor(
    private readonly walletAuthService: WalletAuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Предположим, что walletAddress и signature приходят в заголовках
    // Или вы можете брать из тела запроса
    const walletAddress = request.headers['x-wallet-address'] as string;
    const signature = request.headers['x-signature'] as string;

    if (!walletAddress || !signature) {
      throw new UnauthorizedException('Missing wallet address or signature');
    }

    // Проверяем подпись
    const isValid = await this.walletAuthService.verifySignature(walletAddress, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Ищем пользователя в БД
    const user = await this.usersService.findByWallet(walletAddress);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Пробрасываем user дальше
    (request as any).user = user;
    return true;
  }
}
