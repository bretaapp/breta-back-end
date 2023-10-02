import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './entities/rating.entity';
import { User } from '../user/entities/user.entity';
import { Salon } from '../salon/entities/salon.entity';

import { CreateRatingInput } from './dto/create-rating.input';
import { UpdateRatingInput } from './dto/update-rating.input';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private raitingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Salon) private salonRepo: Repository<Salon>,
  ) {}

  async create(
    user_id: string,
    salon_id: number,
    createRatingInput: CreateRatingInput,
  ) {
    const user = await this.userRepo.findOne({
      where: { user_id },
      relations: { profile: true },
    });

    if (!user) throw new BadRequestException(['Utilize un usuario valido']);

    const salon = await this.salonRepo.findOneBy({ salon_id });

    if (!salon) throw new BadRequestException(['Seleccione un salón valido']);

    const newRating = this.raitingRepo.create(createRatingInput);

    const profile = user.profile;

    newRating.user = profile;
    newRating.salon = salon;

    return this.raitingRepo.save(newRating);
  }

  async findAll() {
    const ratings = await this.raitingRepo.find();

    if (!ratings) throw new NotFoundException(['No se encontraron ratings']);

    return ratings;
  }

  async findOne(rating_id: number) {
    const rating = await this.raitingRepo.findOne({
      where: { rating_id },
      relations: { user: true, salon: true },
    });

    if (!rating) throw new NotFoundException(['No se encontró el rating']);

    return rating;
  }

  async update(rating_id: number, updateRatingInput: UpdateRatingInput) {
    const rating = await this.raitingRepo.findOneBy({ rating_id });

    if (!rating) throw new BadRequestException(['Seleccione un salón valido']);

    this.raitingRepo.merge(rating, updateRatingInput);

    return this.raitingRepo.save(rating);
  }

  async remove(rating_id: number) {
    const rating = await this.raitingRepo.findOneBy({ rating_id });

    if (!rating) throw new BadRequestException(['El rating no existe']);

    return this.raitingRepo.delete(rating_id);
  }
}
