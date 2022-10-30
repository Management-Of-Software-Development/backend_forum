import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
import { PostCategory } from '../enums/post-category.enum';
export class UpdatePostDto {
  @Expose()
  @IsArray()
  @IsUrl({},{each:true})
  @IsOptional()
  attachment: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;
}
