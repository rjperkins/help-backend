import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChatService } from '../../dynamodb/chat/Service';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-chats-by-id-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);

  try {
    if (!event.pathParameters) {
      return httpResponse(500, {
        error: new Error('Must include path parameters.').message,
      });
    }
    const {
      pathParameters: { id },
    } = event;

    if (!id) {
      return httpResponse(500, {
        error: new Error('Must include userId in path parameters.').message,
      });
    }

    const ddbRes = await ChatService.getChatsByUserId(id);

    const output = {
      service: logTag,
      body: ddbRes,
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
