import ConnectionService from '../../dynamodb/connections/Service';
import debug from 'debug';
import { httpResponse, base64Ids, HttpResponse } from '../../lib/utils';

const logTag = 'connect-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);
const debugError = debug(`ws-api:error:${logTag}`);

export const main = async (event: any): Promise<HttpResponse> => {
  // debugVerbose('event', event);

  const userId1 = event.queryStringParameters.userId1;
  const userId2 = event.queryStringParameters.userId2;

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

    const output = {
      service: logTag,
      body: chatId,
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
