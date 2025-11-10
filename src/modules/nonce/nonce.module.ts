import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { NonceService } from './nonce.service';
import { NonceController } from './nonce.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [NonceService],
  controllers: [NonceController],
})
export class NonceModule {}