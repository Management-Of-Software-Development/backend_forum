import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { CreateCommentDto } from './dtos/createComment.dto';
import { Comment, CommentModel } from './comment.model';

export class CommentRepository {
  async getCommentList(
    limit: number,
    query: FilterQuery<Comment>,
    selectQuery: {},
    populateOptions: any[],
    sortQuery: string,
  ) {
    return CommentModel.find(query)
      .select(selectQuery)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getNumberOfCommentWithFilter(query: FilterQuery<Comment>) {
    return CommentModel.countDocuments(query);
  }

  async createComment(author_id: string, createCommentDto: CreateCommentDto) {
    const newComment = new CommentModel({
      user_id: author_id,
      ...createCommentDto,
    });
    await newComment.save();
    return newComment;
  }

  async updateComment(query: FilterQuery<Comment>, updateComment: UpdateQuery<Comment>) {
    return CommentModel.findOneAndUpdate(query, updateComment, {
      new: true,
    });
  }
}
