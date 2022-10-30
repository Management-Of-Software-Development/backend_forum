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
import { PostStatus } from '../enums/post-status.enum';
export class UpdatePostStatusDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status:PostStatus;
}
