import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-user-by-id-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);

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

    const output = await UserService.getUserById(id);
    const user = output[0];

    if (!user) {
      throw new Error('User does not exist.');
    }

    debugVerbose('output %j', user);

    return httpResponse(200, {
      service: logTag,
      body: output,
    });
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
