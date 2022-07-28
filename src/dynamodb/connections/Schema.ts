// @ts-nocheck
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import Config from '../../lib/Config';
// Code.
const schema = new dynamoose.Schema(
  {
    connectionId: {
      type: String,
      hashKey: true,
    },
    chatId: {
      type: String,
      index: {
        global: true,
        name: 'chatId-index',
      },
    },
  },
  {
    timestamps: true,
  }
);

export class Connection extends Document {
  chatId: string;
  connectionId: string;
}

export const ConnectionModel = dynamoose.model<Connection>(
  `${Config.stage}-help-app-connections-table`,
  schema,
  {
    create: false,
  }
);
