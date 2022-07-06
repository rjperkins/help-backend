import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import RequestService from '../../dynamodb/requests/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-requests-by-user-id-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);
  try {
    if (!event.pathParameters) {
      return httpResponse(500, {
        error: new Error('Must include path parameters.').message,
      });
    }
    const {
      pathParameters: { userId },
    } = event;

    if (!userId) {
      return httpResponse(500, {
        error: new Error('Must include userId in path parameters.').message,
      });
    }

    const ddbRes = await RequestService.getRequestsByUserId(userId);

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
