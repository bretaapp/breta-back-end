import { User } from '../user/entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { GalleryInput } from '../user/dto/gallery.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(user_id: string, createProfileInput?: CreateProfileInput) {
    const user = await this.userRepo.findOneBy({ user_id });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newProfile = this.profileRepo.create(createProfileInput);
    newProfile.user = user;

    return this.profileRepo.save(newProfile);
  }

  async findAll() {
    const profiles = await this.profileRepo.find({
      relations: { user: true },
    });

    if (!profiles) throw new NotFoundException('No se encontró ningún perfil');

    return profiles;
  }

  async findOne(profile_id: string) {
    const profile = await this.profileRepo.findOne({
      where: { profile_id },
      relations: {
        user: true,
        salons: true,
      },
    });

    if (!profile) throw new NotFoundException('No se encontró el perfil');

    return profile;
  }

  async update(user_id: string, updateProfileInput: UpdateProfileInput) {
    const user = await this.userRepo.findOne({
      where: { user_id },
      relations: { profile: true },
    });

    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    const profile_id = user.profile.profile_id;

    const profile = await this.profileRepo.findOne({
      where: { profile_id },
      relations: { user: true },
    });

    if (!profile) throw new NotFoundException('No se encontró perfil');

    this.profileRepo.merge(profile, updateProfileInput);

    return this.profileRepo.save(profile);
  }

  async addToGallery(galleryInput: GalleryInput) {
    const user = await this.userRepo.findOne({
      where: { user_id: galleryInput.user_id },
      relations: { profile: true },
    });

    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    const profile_id = user.profile.profile_id;

    return await this.profileRepo.update(
      { profile_id },
      {
        image_gallery: { ...galleryInput.images },
      },
    );
  }

  async remove(user_id: string) {
    const user = await this.userRepo.findOne({
      where: { user_id },
      relations: ['profile'],
    });

    const profile_id = user.profile.profile_id;

    const profile = await this.profileRepo.findOneBy({ profile_id });

    if (!profile) throw new NotFoundException('El perfil no existe');

    return this.profileRepo.delete({ profile_id });
  }
}
