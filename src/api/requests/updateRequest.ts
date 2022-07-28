import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import RequestService from '../../dynamodb/requests/Service';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'update-request-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);

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
      error: new Error('Must include id in path parameters.').message,
    });
  }

  try {
    const ddbRes = await RequestService.getRequestById(id);
    const request = ddbRes[0];

    if (!request) {
      throw new Error('Request does not exist.');
    }

    const { body: rawBody } = event;
    const body = JSON.parse(rawBody as string);

    const updatedEntry = await RequestService.updateRequestById(id, body);

    const output = {
      service: logTag,
      body: updatedEntry,
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
