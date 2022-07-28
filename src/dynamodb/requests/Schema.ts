// @ts-nocheck
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import Config from '../../lib/Config';

// Code.
const schema = new dynamoose.Schema(
  {
    requestId: {
      type: String,
      hashKey: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: {
        global: true,
        name: 'userId-index',
      },
    },
    acceptedUserId: {
      type: String,
      index: {
        global: true,
        name: 'acceptedUserId-index',
      },
    },
    request: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    give: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    photoS3Url: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export class Request extends Document {
  requestId: string;
  userId: string;
  acceptedUserId: string;
  request: string;
  description: string;
  give: boolean;
  category: string;
  location: string;
  photoS3Url: string;
  completed: boolean;
}

export const RequestModel = dynamoose.model<Request>(
  `${Config.stage}-help-app-requests-table`,
  schema,
  {
    create: false,
  }
);
