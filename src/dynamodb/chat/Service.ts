import { base64Ids } from '../../lib/utils';
import { Chat, ChatModel } from './Schema';
export interface Message {
  text: string;
  sender: string;
  receiver: string;
}

export class ChatService {
  public static createChat(input: {
    chatId: string;
    userId1: string;
    userId2: string;
    name: string;
  }): Promise<Chat> {
    const { chatId, userId1, userId2, name } = input;

    return ChatModel.create({
      id: chatId,
      userId1: userId1,
      userId2: userId2,
      name,
      messages: JSON.stringify([]),
    });
  }

  public static getChat(id1: string, id2: string) {
    const chatId = base64Ids(id1, id2);
    return ChatModel.query('id').eq(chatId).exec();
  }

  public static async getChatsByUserId(userId: string) {
    const chats = [
      ...(await ChatModel.query('userId1').eq(userId).exec()),
      ...(await ChatModel.query('userId2').eq(userId).exec()),
    ];

    return chats;
  }

  public static updateChatById(
    id: string,
    input: {
      messages: string;
    }
  ) {
    return ChatModel.update(id, input);
  }

  public static deleteChat(id: string) {
    return ChatModel.delete(id);
  }
}
