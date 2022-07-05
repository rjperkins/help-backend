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
  },
  {
    timestamps: true,
  }
);

export class Connection extends Document {
  connectionId: string;
}

export const ConnectionModel = dynamoose.model<Connection>(
  `${Config.stage}-help-app-connections-table`,
  schema,
  {
    create: false,
  }
);
