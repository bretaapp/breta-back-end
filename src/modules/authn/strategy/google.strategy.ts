import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAuthLoginInput } from 'src/modules/user/dto/oauth.input';

const configService = new ConfigService();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    access_token: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { email, name, email_verified, picture } = profile._json;

    console.log({ email_verified: email_verified });

    let is_verified: true | false = false;

    if (email_verified) {
      is_verified = true;
    }

    const payload: OAuthLoginInput = {
      email: email,
      full_name: name,
      profile_picture: picture,
      is_verified: is_verified,
      done: done,
    };

    return payload;
  }
}
