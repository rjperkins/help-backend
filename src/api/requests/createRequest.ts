import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { httpResponse } from '../../lib/utils/httpResponse';
import RequestService from '../../dynamodb/requests/Service';
import debug from 'debug';

const logTag = 'create-request-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);
  const { body: rawBody } = event;

  const body = JSON.parse(rawBody as string);

  try {
    const ddbRes = await RequestService.createRequest(body);

    return httpResponse(200, {
      service: logTag,
      body: ddbRes,
    });
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
