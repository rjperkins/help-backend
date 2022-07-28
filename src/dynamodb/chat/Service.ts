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
  }): Promise<Chat> {
    const { chatId, userId1, userId2 } = input;

    return ChatModel.create({
      id: chatId,
      userId1: userId1,
      userId2: userId2,
      messages: JSON.stringify([]),
    });
  }

  public static getChat(chatId: string) {
    return ChatModel.query('id').eq(chatId).exec();
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
