import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-users-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event', event);
  try {
    const ddbRes = await UserService.getUsers();

    const output = {
      service: logTag,
      body: ddbRes,
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
