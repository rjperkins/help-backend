import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';
import { Chat, ChatService } from '../../dynamodb/chat';
import { QueryResponse } from 'dynamoose/dist/DocumentRetriever';
import { base64Ids } from '../../lib/utils';
const logTag = 'get-chat-id-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);
  let chat: Chat = { messages: [] } as unknown as Chat;

  try {
    if (!event.pathParameters) {
      return httpResponse(500, {
        error: new Error('Must include path parameters.').message,
      });
    }
    const {
      pathParameters: { id1, id2, name },
    } = event;

    console.log(id1, id2, name);

    if (!id1 || !id2) {
      return httpResponse(500, {
        error: new Error('Must include both ids in path parameters.').message,
      });
    }
    const chatId = base64Ids(id1, id2);
    const entry: QueryResponse<Chat> = await ChatService.getChat(id1, id2);

    debugVerbose('entry', entry[0]);

    if (!entry[0]) {
      chat = await ChatService.createChat({
        chatId,
        userId1: id1,
        userId2: id2,
        name: name || 'Chat',
      });
    } else {
      chat = entry[0];
    }

    const output = {
      service: logTag,
      body: chat,
    };
    debugVerbose('output', output);

    return httpResponse(200, output);
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
