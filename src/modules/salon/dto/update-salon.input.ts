import { CreateSalonInput } from './create-salon.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSalonInput extends PartialType(CreateSalonInput) {}
