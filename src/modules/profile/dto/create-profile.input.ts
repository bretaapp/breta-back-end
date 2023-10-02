import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  wallpaper?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profile_picture?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  image_gallery?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
