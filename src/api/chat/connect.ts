import ConnectionService from '../../dynamodb/connections/Service';
import { ChatService, Chat } from '../../dynamodb/chat';
import debug from 'debug';
import { httpResponse, base64Ids, HttpResponse } from '../../lib/utils';
import { QueryResponse } from 'dynamoose/dist/DocumentRetriever';

const logTag = 'connect-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);
const debugError = debug(`ws-api:error:${logTag}`);

export const main = async (event: any): Promise<HttpResponse> => {
  // debugVerbose('event', event);

  let chat: Chat = { messages: [] } as unknown as Chat;

  const userId1 = event.headers.userId1;
  const userId2 = event.headers.userId2;

  if (!userId1 || !userId2) {
    return httpResponse(400, {
      service: logTag,
      error: 'userId1 and userId2 are required as headers',
    });
  }

  try {
    const chatId = base64Ids(userId1, userId2);

    await ConnectionService.createConnection({
      connectionId: event.requestContext.connectionId,
      chatId,
    });

    const entry: QueryResponse<Chat> = await ChatService.getChat(chatId);
    debugVerbose('entry', entry[0]);

    if (!entry[0]) {
      chat = await ChatService.createChat({ chatId, userId1, userId2 });
    } else {
      chat = entry[0];
    }

    const output = {
      service: logTag,
      body: chat.messages,
    };
    debugVerbose('output', output);

    return httpResponse(200, output);
  } catch (e) {
    debugError('error %s', e.message);
    return httpResponse(500, {
      service: logTag,
      error: e.message,
    });
  }
};
