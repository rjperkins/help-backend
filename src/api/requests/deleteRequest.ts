import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { httpResponse } from '../../lib/utils/httpResponse';
import RequestService from '../../dynamodb/requests/Service';
import debug from 'debug';

const logTag = 'delete-request-handler';
const debugVerbose = debug('api:verbose:delete-request');
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
      pathParameters: { id },
    } = event;

    if (!id) {
      return httpResponse(500, {
        error: new Error('Must include id in path parameters.').message,
      });
    }

    const ddbRes = await RequestService.getRequestById(id);
    const user = ddbRes[0];

    if (!user) {
      throw new Error('Request does not exist.');
    }

    await RequestService.deleteRequestById(id);

    return httpResponse(200, {
      service: logTag,
      body: 'Request deleted correctly',
    });
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
