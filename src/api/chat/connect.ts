import ConnectionService from '../../dynamodb/connections/Service';
import { ChatService, Chat } from '../../dynamodb/chat';
import debug from 'debug';
import { httpResponse, base64Ids } from '../../lib/utils';
import { QueryResponse } from 'dynamoose/dist/DocumentRetriever';

const logTag = 'connect-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);

export const handler = async (event: any) => {
  debugVerbose('event %j', event);

  let chat: Chat;

  try {
    const body = JSON.parse(event.body);

    const { userId1, userId2 } = body;

    const connectionId = base64Ids(userId1, userId2);

    await ConnectionService.createConnection({ connectionId });

    const entry: QueryResponse<Chat> = await ChatService.getChat({
      chatId: connectionId,
    });

    if (!entry) {
      chat = await ChatService.createChat({ userId1, userId2 });
    } else {
      chat = entry[0];
    }
    debugVerbose('chat %j', chat);
  } catch (e) {
    return httpResponse(500, {
      service: logTag,
      error: e.message,
    });
  }
  return httpResponse(200, {
    service: logTag,
    body: chat.messages,
  });
};
