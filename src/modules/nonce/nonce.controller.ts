import { Controller, Get, Param } from '@nestjs/common';
import { NonceService } from './nonce.service';

@Controller('auth/nonce')
export class NonceController {
  constructor(private readonly nonceService: NonceService) {}

  @Get(':walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {
    return { nonce: await this.nonceService.getOrGenerateNonce(walletAddress) };
  }

  @Get('guest/random')
  async getGuestNonce() {
    return { nonce: await this.nonceService.generateNonceForGuest() };
  }
}