import Bull, { Queue } from 'bull';
import { reactPostAndCommentProcessor } from './reactPostAndComment.processor';

export type reactPostAndComment = {
  user_id: string, reacted_object_id: string
};

export const reactPostAndCommentQueue: Queue<reactPostAndComment> = new Bull(
  'react-post-and-comment',
  {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  },
);

reactPostAndCommentQueue.process(reactPostAndCommentProcessor);
