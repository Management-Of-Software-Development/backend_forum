import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { CommentStatus } from './enums/comment-status.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  },
})
export class Comment {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, type: Types.ObjectId, ref: () => Post })
  post_id: Ref<Post>;

  @prop({ required: false, type: Types.ObjectId, ref: () => Comment })
  reply_to_comment_id: Ref<Comment>;

  @prop({ required: true })
  content: string;

  @prop({ required: false })
  attachment: string[];

  @prop({ required: true, enum: CommentStatus })
  status: CommentStatus;

  @prop({ required: false, default: 0 })
  number_of_like: number;

  @prop({ required: false, default: 0 })
  number_of_reply: number;

  @prop({})
  create_time: Date;
}

export type CommentDocument = DocumentType<Comment>;
export const CommentModel = getModelForClass(Comment);
