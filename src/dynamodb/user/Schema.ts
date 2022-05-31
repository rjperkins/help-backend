import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

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
  `debug-help-app-bunch-o-cunts`,
  schema,
  {
    create: false,
  }
);
