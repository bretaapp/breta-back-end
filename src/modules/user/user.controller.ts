import { Controller, Get, Request, UseGuards, Body } from '@nestjs/common';
import { GoogleOAuthGuard } from 'src/guards/auth/google-oauth.guard';
import { AuthService } from '../authn/auth.service';
import { FacebookOAuthGuard } from 'src/guards/auth/facebook-oauth.guard';

@Controller('oauth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get('google-auth')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    return { message: 'Google Auth' };
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req, @Body() remember?: boolean) {
    return this.authService.oauthLogin(req, remember);
  }

  @Get('facebook-auth')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth() {
    return { message: 'Facebook Auth' };
  }

  @Get('facebook-redirect')
  @UseGuards(FacebookOAuthGuard)
  facebookAuthRedirect(@Request() req) {
    return this.authService.oauthLogin(req);
  }
}
