import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { CharacterClass } from '../users/enums/character-class.enum';
import { UserService } from '../users/user.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  async getProfileByUserId(userId?: number) {
    const users = await this.userRepository.find({
      where: { id: userId },
    });

    if (!users[0]) {
      throw new NotFoundException('User not found');
    }
    const user = users[0];

    const energyUser = await this.userService.setEnergyAndCoins(user.walletAddress);


    const [allUsers, totalUsers] = await this.userRepository.findAndCount({
      select: ['id', 'gameCoins'],
      order: {
        gameCoins: 'DESC',
      },
    });

    const place = allUsers.findIndex((user) => user.id === userId) + 1;

    console.info(energyUser)
    return {
      ...energyUser,
      isProfileCompleted: !!user.username,
      place: place,
      totalUsers: totalUsers,
    };
  }


  async updateProfile(userId: number, username: string, characterClass: CharacterClass) {
    if (!username || username.length < 3 || username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new BadRequestException('Invalid username');
    }

    const users = await this.userRepository.find({ where: { id: userId } });

    if (!users[0]) {
      throw new NotFoundException('User not found');
    }

    const user = users[0];

    user.username = username;
    user.characterClass = characterClass;

    await this.userRepository.save(user);

    return {
      ...user,
      isProfileCompleted: true,
    };
  }
}