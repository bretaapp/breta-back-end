import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { Rating } from './entities/rating.entity';

import { RatingService } from './rating.service';

import { CreateRatingInput } from './dto/create-rating.input';
import { UpdateRatingInput } from './dto/update-rating.input';

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Mutation(() => Rating)
  createRating(
    @Args('user_id') user_id: string,
    @Args('salon_id') salon_id: number,
    @Args('createRatingInput') createRatingInput: CreateRatingInput,
  ) {
    return this.ratingService.create(user_id, salon_id, createRatingInput);
  }

  @Query(() => [Rating], { name: 'ratings' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Query(() => Rating, { name: 'rating' })
  findOne(@Args('rating_id', { type: () => Int }) rating_id: number) {
    return this.ratingService.findOne(rating_id);
  }

  @Mutation(() => Rating)
  updateRating(
    @Args('rating_id', { type: () => ID }) rating_id: number,
    @Args('updateRatingInput') updateRatingInput: UpdateRatingInput,
  ) {
    return this.ratingService.update(rating_id, updateRatingInput);
  }

  @Mutation(() => Rating)
  removeRating(@Args('rating_id', { type: () => ID }) rating_id: number) {
    return this.ratingService.remove(rating_id);
  }
}
