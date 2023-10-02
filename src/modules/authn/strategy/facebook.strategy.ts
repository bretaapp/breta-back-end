import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { OAuthLoginInput } from 'src/modules/user/dto/oauth.input';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('FB_CLIENT_ID'),
      clientSecret: configService.get('FB_CLIENT_SECRET'),
      callbackURL: configService.get('FB_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['emails', 'name', 'gender', 'displayName', 'photos'],
      enableProof: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { email, name, picture } = profile._json;

    const payload: OAuthLoginInput = {
      email: email,
      full_name: name,
      profile_picture: picture.url,
      is_verified: true,
      done: done,
    };

    return payload;
  }
}
