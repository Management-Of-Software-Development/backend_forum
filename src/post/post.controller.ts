import {
  JsonController,
  Authorized,
  Post,
  CurrentUser,
  Body,
  Put,
  Param,
  Delete,
  BadRequestError,
  NotFoundError,
  Get,
  QueryParam,
  Patch,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserDocument } from '../user/user.model';
import { CreateAnnouncementPostDto } from './dtos/createAnnouncementPost.dtos';
import { CreateRegularPostDto } from './dtos/createRegularPost.dto';
import { UpdatePostDto } from './dtos/updatePost.dto';
import { UpdatePostStatusDto } from './dtos/updatePostStatus.dto';
import { PostService } from './post.service';
@JsonController('/post')
export class PostController {
  private readonly postService = new PostService();

  @Get('/public', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get public post',
  })
  @Authorized(['admin', 'customer'])
  async getPublicPost(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('status')
    status: string,
    @QueryParam('category')
    category: string,
    @QueryParam('author_id')
    author_id: string,
    @CurrentUser({ required: true }) user: UserDocument,
  ) {
    try {
      return this.postService.getPublicPost(page, limit, category,status,author_id, user);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/public/:post_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get public post details',
  })
  @Authorized(['admin', 'customer'])
  async getPublicPostDetails(@Param('post_id') post_id: string) {
    try {
      return this.postService.getPublicPostDetail(post_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myPost', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get my post',
  })
  @Authorized(['admin', 'customer'])
  async getMyPosts(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('status')
    status: string,
    @CurrentUser({ required: true }) user: UserDocument,
  ) {
    try {
      return this.postService.getMyPosts(user._id, page, limit, status);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myPost/:post_id', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get my post post detail',
  })
  async getMyPostDetail(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('post_id') post_id: string,
  ) {
    try {
      return this.postService.getMyPostDetail(user._id, post_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/regular', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create regular (both customer and admin can create) Post',
  })
  async createRegularPost(
    @CurrentUser({ required: true }) user: UserDocument,
    @Body() createPostDto: CreateRegularPostDto,
  ) {
    try {
      if (
        !(await this.postService.createRegularPost(user._id, createPostDto))
      ) {
        throw new NotFoundError('Cannot create : Not found !');
      }
      return {
        message: 'Created Sucessfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/announcement', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create announcement (only admin) Post',
  })
  async createAdminPermissionOnlyPost(
    @CurrentUser({ required: true }) user: UserDocument,
    @Body() createPostDto: CreateAnnouncementPostDto,
  ) {
    try {
      if (
        !(await this.postService.createRegularPost(user._id, createPostDto))
      ) {
        throw new NotFoundError('Cannot create : Not found !');
      }
      return {
        message: 'Created Sucessfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Put('/:post_id', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Modify official post',
  })
  async updateOfficialPost(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('post_id') post_id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    try {
      if (
        !(await this.postService.updateOfficialPost(
          user._id,
          post_id,
          updatePostDto,
        ))
      )
        throw new NotFoundError('Cannot update : Not found !');
      return {
        message: 'Updated Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Delete('/:post_id', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete post',
  })
  async deletePost(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('post_id') post_id: string,
  ) {
    try {
      if (!(await this.postService.deletePost(user._id, post_id))) {
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

  @Patch('/lock/:post_id', { transformResponse: false })
  @Authorized(['admin', 'customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Lock post comment',
  })
  async lockPostComment(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('post_id') post_id: string,
  ) {
    try {
      if (!(await this.postService.lockPostComment(user._id, post_id))) {
        throw new NotFoundError('Cannot lock : Not found !');
      }
      return {
        message: 'Post Locked Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Patch('/review/:post_id', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Admin approve/deny a post',
  })
  async approveAndDenyPost(
    @Param('post_id') post_id: string,
    @Body({ required: true }) updatePostStatusDto: UpdatePostStatusDto,
  ) {
    try {
      if (
        !(await this.postService.approveAndDenyPost(
          post_id,
          updatePostStatusDto.status,
        ))
      ) {
        throw new NotFoundError('Cannot approve : Not found !');
      }
      return {
        message: 'Update Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
