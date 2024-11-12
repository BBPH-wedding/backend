import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EntryVerificationDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Get("prueba")
  async pruebaEmail(@Body() body: any) {
    return await this.authService.pruebaEmail(body);
  }
}
