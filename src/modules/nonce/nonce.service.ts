import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class NonceService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getOrGenerateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const user = await this.userRepository.findOne({ where: { walletAddress } });

    if (user) {
      user.nonce = nonce;
      await this.userRepository.save(user);
      return nonce;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async generateNonceForGuest(): Promise<string> {
    return Math.floor(Math.random() * 1000000).toString();
  }

  async updateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const user = await this.userRepository.findOneBy({ walletAddress });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.nonce = nonce;
    await this.userRepository.save(user);

    return nonce;
  }
}
