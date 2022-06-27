import { v4 as uuid } from 'uuid';
import { RequestModel } from './Schema';

export default class Request {
  public static async createRequest(input: {
    userId: string;
    request: string;
    description: string;
    category: string;
    location: string;
    photoS3Url: string;
  }): Promise<Request> {
    const { userId, request, description, category, location, photoS3Url } =
      input;

    const output = await RequestModel.create({
      requestId: uuid(),
      userId,
      request,
      description,
      category,
      location,
      photoS3Url,
    });

    return output;
  }

  public static async getRequests() {
    const output = await RequestModel.scan().exec();
    return output;
  }

  public static async getRequestsByUserId(userId: string) {
    const output = await RequestModel.query('userId').eq(userId).exec();
    return output;
  }

  public static async getRequestById(id: string) {
    const output = await RequestModel.query('requestId').eq(id).exec();
    return output;
  }

  public static async deleteRequestById(id: string) {
    const output = await RequestModel.delete(id);
    return output;
  }

  public static async updateRequestById(
    requestId: string,
    input: {
      acceptedUserId?: string;
      decription?: string;
      category?: string;
      location?: string;
      photoS3Url?: string;
      completed?: boolean;
    }
  ): Promise<Request> {
    const output = await RequestModel.update(requestId, input);
    return output;
  }
}
