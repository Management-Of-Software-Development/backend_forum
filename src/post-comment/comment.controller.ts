import {
  JsonController,
  Authorized,
  CurrentUser,
  Body,
  Put,
  Post,
  Param,
  Delete,
  BadRequestError,
  NotFoundError,
  Get,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserDocument } from '../user/user.model';
import { CreateCommentDto } from './dtos/createComment.dto';
import { CommentService } from './comment.service';
@JsonController('/comment')
export class CommentController {
  private readonly commentService = new CommentService();

  @Get('/post-comment/:post_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get comments of a post',
  })
  @Authorized(['admin','customer'])
  async getPostComment(
    @Param('post_id') post_id: string,
    @QueryParam('limit_per_load') limitPerLoad: number,
    @QueryParam('last_prev_comment_id') lastPrevCommentId: string,
  ) 
  {
    try {
      if (!limitPerLoad) limitPerLoad = 5;
      return this.commentService.getPostComment(
        post_id,
        limitPerLoad,
        lastPrevCommentId,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/comment-replies/:comment_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get replies of a comment',
  })
  @Authorized(['admin','customer'])
  async getCommentReplies(
    @Param('comment_id') comment_id: string,
    @QueryParam('limit_per_load') limitPerLoad: number,
    @QueryParam('last_prev_comment_id') lastPrevCommentId: string,
  ) {
    try {
      if (!limitPerLoad) limitPerLoad = 5;
      return this.commentService.getCommentReplies(
        comment_id,
        limitPerLoad,
        lastPrevCommentId,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/:post_id', { transformResponse: false })
  @Authorized(['admin','customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create Comment',
  })
  async createComment(
    @Param('post_id') post_id: string,
    @CurrentUser({ required: true }) user: UserDocument,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      const data = await this.commentService.createComment(
        user._id,
        post_id,
        createCommentDto,
      );
      if (!data) {
        throw new NotFoundError('Cannot create : Not found !');
      }
      return data;
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Delete('/:comment_id', { transformResponse: false })
  @Authorized(['admin','customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete comment',
  })
  async deleteComment(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('comment_id') comment_id: string,
  ) {
    try {
      if (!(await this.commentService.deleteComment(user._id, comment_id))) {
        throw new NotFoundError('Cannot delete : Not found !');
      }
      return {
        message: 'Deleted Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
