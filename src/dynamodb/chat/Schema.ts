// @ts-nocheck
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import Config from '../../lib/Config';
// Code.
const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
    },
    userId1: {
      type: String,
      required: true,
      index: {
        global: true,
        name: 'userId1-index',
      },
    },
    userId2: {
      type: String,
      required: true,
      index: {
        global: true,
        name: 'userId2-index',
      },
    },
    name: { type: String },
    messages: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export class Chat extends Document {
  id: string;
  userId1: string;
  userId2: string;
  name: string;
  messages: string;
}

export const ChatModel = dynamoose.model<Chat>(
  `${Config.stage}-help-app-chat-table`,
  schema,
  {
    create: false,
  }
);
