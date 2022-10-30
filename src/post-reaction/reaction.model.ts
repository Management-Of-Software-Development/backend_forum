import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  },
})
export class Reaction {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, type: Types.ObjectId })
  reacted_object_id: Types.ObjectId;

  @prop({})
  create_time: Date;
}

export type ReactionDocument = DocumentType<Reaction>;
export const ReactionModel = getModelForClass(Reaction);
