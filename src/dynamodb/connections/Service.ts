import { Connection, ConnectionModel } from './Schema';

export interface Message {
  text: string;
  sender: string;
  receiver: string;
}

export default class ConnectionService {
  public static async createConnection(input: {
    connectionId: string;
    chatId: string;
  }): Promise<Connection> {
    return await ConnectionModel.create(input);
  }

  public static async getConnectionByChatId(chatId: string) {
    return await ConnectionModel.query('chatId').eq(chatId).exec();
  }

  public static async getConnections() {
    return await ConnectionModel.scan().exec();
  }

  public static async deleteConnection(connectionId: string) {
    return await ConnectionModel.delete(connectionId);
  }
}
