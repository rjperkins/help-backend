import ConnectionService from '../../dynamodb/connections/Service';
import debug from 'debug';
import { httpResponse } from '../../lib/utils/httpResponse';

const logTag = 'disconnect-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);

export const handler = async (event: any) => {
  debugVerbose('event %j', event);
  try {
    const output = await ConnectionService.deleteConnection(
      event.requestContext.connectionId
    );
    debugVerbose('output %j', output);
  } catch (e) {
    return httpResponse(500, {
      service: logTag,
      error: e.message,
    });
  }
  return httpResponse(200, {
    service: logTag,
    body: 'success',
  });
};
