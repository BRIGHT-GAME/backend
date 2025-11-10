import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Get,
  Param,
  Req,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response } from "express";
import { UserService } from "../users/user.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtPayload } from "./types";
import { JwtService } from "@nestjs/jwt";
import { Request as RequestI } from "express"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log("35. auth.controller.", loginDto)
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return { accessToken };
  }

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {

    const tokens = await this.authService.register(dto);
    if (!tokens) throw new UnauthorizedException("Signature invalid");

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return { accessToken: tokens.accessToken };
  }

  @Get('nonce/:walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {

    return await this.authService.updateNonce(walletAddress);
  }

  @Post('refresh')
  async refresh(@Req() req: RequestI, @Res() res: Response) {

    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) throw new UnauthorizedException('Missing refresh token');
  
    const tokens = await this.authService.refreshAccessToken(oldRefreshToken);
    if (!tokens) throw new UnauthorizedException('Invalid refresh token');
  
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
    return res.json({ accessToken: tokens.accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logged out' };
  }
}
