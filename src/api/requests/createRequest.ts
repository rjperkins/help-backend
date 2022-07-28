import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import RequestService from '../../dynamodb/requests/Service';
import debug from 'debug';

const logTag = 'create-request-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);
  const { body: rawBody } = event;

  const body = JSON.parse(rawBody as string);

  try {
    const ddbRes = await RequestService.createRequest(body);

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
