import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import RequestService from '../../dynamodb/requests/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'update-request-handler';
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
    return httpResponse(500, {
      error: new Error('Must include id in path parameters.').message,
    });
  }

  const { body: rawBody } = event;
  const body = JSON.parse(rawBody as string);

  try {
    const ddbRes = await RequestService.updateRequestById(id, body);

    return httpResponse(200, {
      service: logTag,
      body: ddbRes,
    });
  } catch (error) {
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
