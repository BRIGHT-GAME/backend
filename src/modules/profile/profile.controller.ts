import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { CharacterClass } from '../users/enums/character-class.enum';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req: { user: { sub: number }}) {
    const userId = req.user.sub;
    return this.profileService.getProfileByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(
    @Request() req: { user: { sub: number } },
    @Body() body: { username: string; characterClass: CharacterClass },
  ) {
    const userId = req.user.sub;
    console.log(userId)
    const { username, characterClass } = body;
    return this.profileService.updateProfile(userId, username, characterClass);
  }
}