import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-user-by-id-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);

  try {
    if (!event.pathParameters) {
      return httpResponse(500, {
        error: new Error('Must include path parameters').message,
      });
    }

    const { id } = event.pathParameters;

    if (!id) {
      return httpResponse(500, {
        error: new Error('Must include id in path parameters').message,
      });
    }

    const ddbRes = await UserService.getUserById(id);
    const user = ddbRes[0];

    if (!user) {
      throw new Error('User does not exist.');
    }

    const output = {
      service: logTag,
      body: user,
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
