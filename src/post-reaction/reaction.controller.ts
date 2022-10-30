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
import { ReactionService } from './reaction.service';
@JsonController('/reaction')
export class ReactionController {
  private readonly reactionService = new ReactionService();

  @Get('/list-user/:object_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get reactions of a post/comment',
  })
  @Authorized(['admin','customer'])
  async getPostReaction(
    @Param('post_id') post_id: string,
    @QueryParam('limit_per_load') limitPerLoad: number,
    @QueryParam('last_prev_reaction_id') lastPrevReactionId: string,
  ) 
  {
    try {
      if (!limitPerLoad) limitPerLoad = 5;
      return this.reactionService.getObjectReactedUserList(
        post_id,
        limitPerLoad,
        lastPrevReactionId,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/:object_id', { transformResponse: false })
  @Authorized(['admin','customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'toggle like/unlike',
  })
  async toggleReaction(
    @Param('object_id') reacted_object_id: string,
    @CurrentUser({ required: true }) user: UserDocument,
  ) {
    try {
       await this.reactionService.toggleReaction(
        user._id,
        reacted_object_id,
       
      );
      return {
        message : 'Toggle reaction successfully'
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
