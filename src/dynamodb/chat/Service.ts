import { base64Ids } from '../../lib/utils';
import { Chat, ChatModel } from './Schema';

export interface Message {
  text: string;
  sender: string;
  receiver: string;
}

export class ChatService {
  public static async createChat(input: {
    userId1: string;
    userId2: string;
  }): Promise<Chat> {
    const { userId1, userId2 } = input;

    const id = base64Ids(userId1, userId2);

    return await ChatModel.create({
      id,
      userId1: userId1,
      userId2: userId2,
      messages: [],
    });
  }

  public static async getChat(input: {
    userId1?: string;
    userId2?: string;
    chatId?: string;
  }) {
    const { userId1, userId2, chatId } = input;

    if (chatId) {
      return await ChatModel.query().where('id').eq(chatId).exec();
    }
    if (userId1 && userId2) {
      const id = base64Ids(userId1, userId2);
      return await ChatModel.query().where('id').eq(id).exec();
    }
    throw new Error('Either userId1 and userId2 or chatId must be provided');
  }

  public static async updateChatById(
    id: string,
    input: {
      messages: Message[];
    }
  ) {
    return await ChatModel.update(id, input);
  }

  public static async deleteChat(id: string) {
    return await ChatModel.delete(id);
  }
}
