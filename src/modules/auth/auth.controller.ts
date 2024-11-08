import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EntryVerificationDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('entry-verification')
  async entryVerification(@Body() entryVerificationDto: EntryVerificationDto) {
    return await this.authService.entryVerification(entryVerificationDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
