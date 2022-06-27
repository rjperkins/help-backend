import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'update-user-handler';
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

  try {
    const ddbRes = await UserService.getUserById(id);
    const user = ddbRes[0];

    if (!user) {
      throw new Error('User does not exist.');
    }

    const { body: rawBody } = event;
    const body = JSON.parse(rawBody as string);

    await UserService.updateUserById(id, body);

    return httpResponse(200, {
      service: logTag,
      body: 'User updated correctly',
    });
  } catch (error) {
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
