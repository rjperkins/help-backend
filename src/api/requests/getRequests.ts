// lists all requests in the database
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import RequestService from '../../dynamodb/requests/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

// Code.
const logTag = 'get-requests-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);
  try {
    const ddbRes = await RequestService.getRequests();
    debugVerbose('output %j', ddbRes);
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
