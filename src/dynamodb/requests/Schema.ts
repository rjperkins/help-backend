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
    },
    acceptedUserId: {
      type: String,
    },
    request: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    photoS3Url: {
      type: Number,
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
  category: string;
  location: string;
  photoS3Url: string;
}

export const RequestModel = dynamoose.model<Request>(
  `${Config.stage}-help-app-request-table`,
  schema,
  {
    create: false,
  }
);
