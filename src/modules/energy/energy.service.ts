import { Injectable } from '@nestjs/common';
import { EnergyCacheService } from '../cash/energy-cache.service';
import { UserEntity } from '../users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EnergyService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}
}