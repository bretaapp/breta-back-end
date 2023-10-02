import { CreateRatingInput } from './create-rating.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRatingInput extends PartialType(CreateRatingInput) {}
