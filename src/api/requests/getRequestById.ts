// takes an id from the event parameters and returns the request with that id
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import RequestService from '../../dynamodb/requests/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-request-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);

  if (!event.pathParameters) {
    return httpResponse(500, {
      error: new Error('Must include path parameters.').message,
    });
  }

  const {
    pathParameters: { id },
  } = event;

  if (!id) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: new Error('Must include id in path parameters.').message,
      }),
    };
  }

  try {
    const ddbRes = await RequestService.getRequestById(id);
    const request = ddbRes[0];

    if (!request) {
      throw new Error('Request does not exist.');
    }

    return httpResponse(200, {
      service: logTag,
      body: request,
    });
  } catch (error) {
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
