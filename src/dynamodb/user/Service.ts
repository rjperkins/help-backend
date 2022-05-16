import { DynamoDB } from 'aws-sdk';
import Config from '../../lib/Config';

const ddb = new DynamoDB({ apiVersion: '2012-08-10', region: 'us-east-1' });

export default class UserService {
  public static async createUser(input: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    gender: string;
    birthdate: string;
  }) {
    const { id, email, firstName, lastName, address, gender, birthdate } =
      input;

    const ddbRes = await ddb
      .putItem({
        Item: {
          userId: {
            S: id,
          },
          email: {
            S: email,
          },
          firstName: {
            S: firstName,
          },
          lastName: {
            S: lastName,
          },
          rating: {
            N: '0',
          },
          helpsGiven: {
            N: '0',
          },
          helpsReceived: {
            N: '0',
          },
          gender: {
            S: gender,
          },
          address: {
            S: address,
          },
          birthdate: {
            S: birthdate,
          },
        },
        ReturnValues: 'ALL_OLD',
        TableName: Config.userTableName,
      })
      .promise();
  }

  public static async getUsers() {
    return await ddb
      .scan({
        TableName: Config.userTableName,
      })
      .promise();
  }

  public static async getUserById(id: string) {
    return await ddb
      .getItem({
        Key: { userId: { S: id } },
        TableName: Config.userTableName,
      })
      .promise();
  }

  public static async deleteUser(input: { email: string }) {
    return await ddb
      .deleteItem({
        Key: { email: { S: input.email } },
        TableName: Config.userTableName,
      })
      .promise();
  }
}
