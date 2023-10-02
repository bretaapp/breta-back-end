import { CreateServiceInput } from './create-service.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateServiceInput extends PartialType(CreateServiceInput) {}
