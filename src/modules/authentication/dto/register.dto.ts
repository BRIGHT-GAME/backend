import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  walletAddress: string;

  @IsString()
  signature: string;

  @IsString()
  nonce: string;
}