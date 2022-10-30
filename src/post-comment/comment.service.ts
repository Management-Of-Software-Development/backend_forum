import { BadRequestError, NotFoundError } from 'routing-controllers';
import { CategoryService } from '../category/category.service';
import { CreateCommentDto } from './dtos/createComment.dto';
import { CommentStatus } from './enums/comment-status.enum';
import { CommentDocument } from './comment.model';
import { CommentRepository } from './comment.repository';
import { Types } from 'mongoose';
import { PostRepository } from '../post/post.repository';
import { PostStatus } from '../post/enums/post-status.enum';

export class CommentService {
  private readonly commentRepository = new CommentRepository();
  private readonly postRepository = new PostRepository();

  async getPostComment(
    post_id: string,
    limit: number,
    lastPrevCommentId: string,
  ) {
    const query = {
      post_id,
      status: { $not: { $eq: CommentStatus.DELETED } },
    };
    if (lastPrevCommentId) {
      Object.assign(query, {
        _id: { $gt: new Types.ObjectId(lastPrevCommentId) },
      });
    }
    const selectQuery = {};
    const sort_by = 'create_time';
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar' },
    ];
    const data = await this.commentRepository.getCommentList(
      limit,
      query,
      selectQuery,
      populateOptions,
      sort_by,
    );
    return {
      ...data,
    };
  }

  async getCommentReplies(
    comment_id: string,
    limit: number,
    lastPrevCommentId: string,
  ) {
    const query = {
      reply_to_comment_id: comment_id,
      status: { $not: { $eq: CommentStatus.DELETED } },
    };
    if (lastPrevCommentId) {
      Object.assign(query, {
        _id: { $gt: new Types.ObjectId(lastPrevCommentId) },
      });
    }
    const selectQuery = {};
    const sort_by = 'create_time';
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar' },
    ];
    const data = await this.commentRepository.getCommentList(
      limit,
      query,
      selectQuery,
      populateOptions,
      sort_by,
    );
    return {
      ...data,
    };
  }

  async createComment(
    admin_id: string,
    post_id: string,
    createCommentDto: CreateCommentDto,
  ) {
    if (
      !(await this.postRepository.getPublicPostDetail(
        { _id: post_id, status: PostStatus.ACTIVE },
        [],
      ))
    )
      throw new BadRequestError('Cannot comment this post !');
    Object.assign(createCommentDto, {
      post_id,
      status: CommentStatus.ACTIVE,
    });
    if (createCommentDto.reply_to_comment_id) {
      await this.commentRepository.updateComment(
        {
          _id: createCommentDto.reply_to_comment_id,
          status: CommentStatus.ACTIVE,
        },
        { $inc: { number_of_reply: 1 } },
      );
    }
    const newComment = await this.commentRepository.createComment(
      admin_id,
      createCommentDto,
    );
    await this.postRepository.updatePost(
      { _id: post_id },
      { $inc: { number_of_comment: 1 } },
    );
    return newComment;
  }

  async deleteComment(user_id: string, comment_id: string) {
    const query = {
      _id: comment_id,
      user_id: user_id,
      status: { $not: { $eq: CommentStatus.DELETED } },
    };
    const updateOptions = { status: CommentStatus.DELETED };

    const deletedComment = await this.commentRepository.updateComment(
      query,
      updateOptions,
    );
    if (!deletedComment)
      throw new NotFoundError('Cannot delete : comment not found');
    await this.postRepository.updatePost(
      { _id: deletedComment.post_id },
      { $inc: { number_of_comment: -1 } },
    );
    if (deletedComment.reply_to_comment_id)
      await this.commentRepository.updateComment(
        {
          _id: deletedComment.reply_to_comment_id,
          status: CommentStatus.ACTIVE,
        },
        { $inc: { number_of_reply: -1 } },
      );
    return deletedComment;
  }
}
