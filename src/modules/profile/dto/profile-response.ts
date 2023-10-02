import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Profile } from '../entities/profile.entity';

@ObjectType()
export class getProfileResponse {
  @Field(() => Profile)
  profile: Profile;

  @Field(() => User, { nullable: true })
  user?: User;
}
