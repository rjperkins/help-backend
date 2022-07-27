import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'update-user-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event', event);

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

  try {
    const ddbRes = await UserService.getUserById(id);
    const user = ddbRes[0];

    if (!user) {
      throw new Error('User does not exist.');
    }

    const { body: rawBody } = event;
    const body = JSON.parse(rawBody as string);

    const updatedUser = await UserService.updateUserById(id, body);

    const output = {
      service: logTag,
      body: updatedUser,
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
