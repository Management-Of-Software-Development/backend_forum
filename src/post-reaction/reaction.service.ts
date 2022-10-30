import { BadRequestError, NotFoundError } from 'routing-controllers';
import { CategoryService } from '../category/category.service';
import { ReactionDocument } from './reaction.model';
import { ReactionRepository } from './reaction.repository';
import { Types } from 'mongoose';
import { PostRepository } from '../post/post.repository';
import { PostStatus } from '../post/enums/post-status.enum';
import { CommentRepository } from '../post-comment/comment.repository';
import { CommentStatus } from '../post-comment/enums/comment-status.enum';
import { reactPostAndCommentQueue } from './queues/registerUser/reactPostAndComment.queue';

export class ReactionService {
  private readonly reactionRepository = new ReactionRepository();

  async getObjectReactedUserList(
    post_id: string,
    limit: number,
    lastPrevReactionId: string,
  ) {
    const query = {
      post_id,
    };
    if (lastPrevReactionId) {
      Object.assign(query, {
        _id: { $gt: new Types.ObjectId(lastPrevReactionId) },
      });
    }
    const selectQuery = {};
    const sort_by = 'create_time';
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar' },
    ];
    const data = await this.reactionRepository.getReactionList(
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

  async toggleReaction(user_id: string, reacted_object_id: string) {
    await reactPostAndCommentQueue.add({
      user_id,
      reacted_object_id,
    });
  }
}
