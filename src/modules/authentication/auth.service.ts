import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { verifySignature } from './utils/signature-verifier';
import { UserService } from '../users/user.service';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(dto: { walletAddress: string; signature: string }) {
    const { walletAddress, signature } = dto;

    const user = await this.userService.findByWallet(walletAddress);
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = verifySignature(walletAddress, signature, user.nonce);
    
    if (!isValid) throw new UnauthorizedException('Invalid signature');

    // TODO: Extract it into another service, add the environment variables
    user.nonce = Math.floor(Math.random() * 1000000).toString();
    await this.userService.saveUser(user);

    console.log( "31. auth.service", user)
    const payload = { sub: user.id, walletAddress: user.walletAddress };

    const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    return {
      accessToken,
      refreshToken
    };
  }

  async register(dto: RegisterDto) {
    const { walletAddress, signature, nonce } = dto;

    const message = new TextEncoder().encode(nonce);
    const pubKey = bs58.decode(walletAddress);
    const sig = bs58.decode(signature);
    

    const isValid = nacl.sign.detached.verify(message, sig, pubKey);
    if (!isValid) return null;

    let user = await this.userService.findByWallet(walletAddress);

    
    if (!user) {
      user = await this.userService.saveUser({
        walletAddress,
        nonce: Math.floor(Math.random() * 1000000).toString(),
      } as any); // TODO: Fix that
    }

    const payload = { sub: user.id };

    const accessToken = await this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = await this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    return {
      accessToken,
      refreshToken
    };
  }

  async updateNonce(walletAddress: string) {
    return this.userService.updateNonce(walletAddress);
  }

  async refreshAccessToken(oldRefreshToken: string) {
    try {
      const payload = await this.jwtService.verify<{ sub: string }>(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
  
      const user = await this.userService.findById(Number(payload.sub));
      if (!user) return null;
  
      const accessToken = await this.jwtService.sign(
        { sub: user.id },
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
      );
  
      const refreshToken = await this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      );
  
      return { accessToken, refreshToken };
    } catch {
      return null;
    }
  }
  
}