import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAdminDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-in-admin')
  async signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    return await this.authService.signInAdmin(signInAdminDto);
  }
}
