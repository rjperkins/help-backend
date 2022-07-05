import { Connection, ConnectionModel } from './Schema';

export interface Message {
  text: string;
  sender: string;
  receiver: string;
}

export default class ConnectionService {
  public static async createConnection(input: {
    connectionId: string;
  }): Promise<Connection> {
    const { connectionId } = input;

    return await ConnectionModel.create({
      connectionId,
    });
  }

  public static async getConnections() {
    return await ConnectionModel.scan().exec();
  }

  public static async deleteConnection(input: { connectionId: string }) {
    const { connectionId } = input;
    return await ConnectionModel.delete(connectionId);
  }
}
