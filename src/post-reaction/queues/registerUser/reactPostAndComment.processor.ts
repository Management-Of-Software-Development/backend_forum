import { Job } from 'bull';
import { BadRequestError } from 'routing-controllers';
import { reactPostAndComment } from './reactPostAndComment.queue';
import { PostStatus } from '../../../post/enums/post-status.enum';
import { CommentStatus } from '../../../post-comment/enums/comment-status.enum';
import { PostModel } from '../../../post/post.model';
import { CommentModel } from '../../../post-comment/comment.model';
import { ReactionModel } from '../../reaction.model';
export async function reactPostAndCommentProcessor(
  job: Job<reactPostAndComment>,
): Promise<void> {
  try {
    const { data } = job;
    const { user_id, reacted_object_id } = data;
    if (
      await ReactionModel.findOneAndDelete({
        reacted_object_id,
        user_id,
      })
    ) {
      await PostModel.findOneAndUpdate(
        {
          _id: reacted_object_id,
          status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
        },
        { $inc: { number_of_like: -1 } },
      );
      await CommentModel.findOneAndUpdate(
        { _id: reacted_object_id, status: CommentStatus.ACTIVE },
        { $inc: { number_of_like: -1 } },
      );
    } else {
      if (
        !(await PostModel.findOneAndUpdate(
          {
            _id: reacted_object_id,
            status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
          },
          { $inc: { number_of_like: 1 } },
        )) &&
        !(await CommentModel.findOneAndUpdate(
          { _id: reacted_object_id, status: CommentStatus.ACTIVE },
          { $inc: { number_of_like: 1 } },
        ))
      )
        throw new BadRequestError('Cannot reaction this post !');
      const reaction = new ReactionModel({ user_id, reacted_object_id });
      await reaction.save();
    }
  } catch (e) {
    throw new BadRequestError(e.message);
  }
}
