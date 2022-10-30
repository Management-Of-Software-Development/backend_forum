import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { CreateRegularPostDto } from './dtos/createRegularPost.dto';
import { Post, PostModel } from './post.model';

export class PostRepository {
  async getPublicPostList(
    page: number,
    limit: number,
    query: FilterQuery<Post>,
    selectQuery: {},
    populateOptions: any[],
    sortQuery: string,
  ) {
    return PostModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getPublicPostDetail(query: FilterQuery<Post>, populateOptions: any[]) {
    return PostModel.find(query).populate(populateOptions);
  }

  async getNumberOfPostWithFilter(query: FilterQuery<Post>) {
    return PostModel.countDocuments(query);
  }

  async createPost(author_id: string, createPostDto: CreateRegularPostDto) {
    const newPost = new PostModel({
      user_id: author_id,
      ...createPostDto,
    });
    await newPost.save();
    return newPost;
  }

  async updatePost(query: FilterQuery<Post>, updatePost: UpdateQuery<Post>) {
    return PostModel.findOneAndUpdate(query, updatePost, {
      new: true,
    });
  }
}
