// @ts-nocheck
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import Config from '../../lib/Config';
// Code.
const schema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        global: true,
        name: 'email-index',
      },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    helpsGiven: {
      type: Number,
    },
    helpsReceived: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    birthdate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export class User extends Document {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  rating: number;
  helpsGiven: number;
  helpsReceived: number;
  gender: string;
  address: string;
  birthdate: string;
}

export const UserModel = dynamoose.model<User>(
  `${Config.stage}-help-app-user-table`,
  schema,
  {
    create: false,
  }
);
