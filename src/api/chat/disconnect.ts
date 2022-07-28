import ConnectionService from '../../dynamodb/connections/Service';
import debug from 'debug';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';

const logTag = 'disconnect-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);

export const main = async (event: any): Promise<HttpResponse> => {
  debugVerbose('event', event);
  try {
    const output = await ConnectionService.deleteConnection(
      event.requestContext.connectionId
    );
    debugVerbose('output %j', output);
    return httpResponse(200, {
      service: logTag,
      body: 'success',
    });
  } catch (e) {
    return httpResponse(500, {
      service: logTag,
      error: e.message,
    });
  }
};
