import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const debugVerbose = debug('api:verbose:user-by-id');

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
    console.log('outputsd', output);

    debugVerbose('output %j', output);

    return httpResponse(200, {
      output,
    });
  } catch (error) {
    return httpResponse(500, {
      error: error.message,
    });
  }
};
