import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Reaction, ReactionModel } from './reaction.model';

export class ReactionRepository {
  async getReactionList(
    limit: number,
    query: FilterQuery<Reaction>,
    selectQuery: {},
    populateOptions: any[],
    sortQuery: string,
  ) {
    return ReactionModel.find(query)
      .select(selectQuery)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getNumberOfReactionWithFilter(query: FilterQuery<Reaction>) {
    return ReactionModel.countDocuments(query);
  }

  async findReactionAndDelete(query: FilterQuery<Reaction>) {
    return ReactionModel.findOneAndDelete(query);
  }

  async createReaction(user_id: string, reacted_object_id: string) {
    const newReaction = new ReactionModel({
      user_id,
      reacted_object_id,
    });
    await newReaction.save();
    return newReaction;
  }
}
