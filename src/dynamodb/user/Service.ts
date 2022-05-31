import * as UserService from './Schema';
import debug from 'debug';

const logTag = 'delete-user-service';
const debugVerbose = debug(`ddb:user:verbose:${logTag}`);

export default class User {
  public static async createUser(input: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    gender: string;
    birthdate: string;
  }): Promise<UserService.User> {
    const { id, email, firstName, lastName, address, gender, birthdate } =
      input;

    const output = await UserService.UserModel.create({
      userId: id,
      email,
      firstName,
      lastName,
      address,
      gender,
      birthdate,
      rating: 0,
      helpsGiven: 0,
      helpsReceived: 0,
    });

    debugVerbose('output', output);
    return output;
  }

  public static async getUsers() {
    return await UserService.UserModel.scan().exec();
  }

  public static async getUserById(id: string) {
    return await UserService.UserModel.query('userId').eq(id).exec();
  }

  public static async deleteUser(id: string) {
    return await UserService.UserModel.delete(id);
  }
}
