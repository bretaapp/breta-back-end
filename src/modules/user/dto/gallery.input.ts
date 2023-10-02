import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class GalleryInput {
  @Field()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty()
  images: string[];
}
