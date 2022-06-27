import { UserModel } from './Schema';

export default class User {
  public static async createUser(input: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    gender: string;
    birthdate: string;
  }): Promise<User> {
    const { id, email, firstName, lastName, address, gender, birthdate } =
      input;

    const output = await UserModel.create({
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

    return output;
  }

  public static async getUsers() {
    return await UserModel.scan().exec();
  }

  public static async getUserById(id: string) {
    return await UserModel.query('userId').eq(id).exec();
  }

  public static async deleteUser(id: string) {
    return await UserModel.delete(id);
  }

  public static async updateUserById(
    id: string,
    input: {
      email?: string;
      firstName?: string;
      lastName?: string;
      address?: string;
      gender?: string;
      birthdate?: string;
      rating?: number;
      helpsGiven?: number;
      helpsReceived?: number;
    }
  ) {
    const output = await UserModel.update(id, input);
    return output;
  }
}
