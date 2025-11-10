import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserEntity } from '../users/entity/user.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}