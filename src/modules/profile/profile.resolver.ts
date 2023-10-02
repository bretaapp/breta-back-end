import { Profile } from './entities/profile.entity';

import { ProfileService } from './profile.service';

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { GalleryInput } from '../user/dto/gallery.input';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  createProfile(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    return this.profileService.create(user_id, createProfileInput);
  }

  @Query(() => [Profile], { name: 'profiles' })
  findAll() {
    return this.profileService.findAll();
  }

  @Query(() => Profile, { name: 'profile' })
  findOne(@Args('profile_id', { type: () => ID }) profile_id: string) {
    return this.profileService.findOne(profile_id);
  }

  @Mutation(() => Profile)
  updateProfile(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('updateProfileInput')
    updateProfileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(user_id, updateProfileInput);
  }

  @Mutation(() => Profile)
  addToGallery(
    @Args('galleryInput', { type: () => GalleryInput })
    galleryInput: GalleryInput,
  ) {
    return this.profileService.addToGallery(galleryInput);
  }

  @Mutation(() => Profile)
  removeProfile(@Args('user_id', { type: () => ID }) user_id: string) {
    return this.profileService.remove(user_id);
  }
}
