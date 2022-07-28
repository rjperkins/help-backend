import AWS from 'aws-sdk';
import debug from 'debug';
import { httpResponse, HttpResponse } from '../../lib/utils';

const logTag = 'default-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);

export const main = async (event: any): Promise<HttpResponse> => {
  debugVerbose('event', event);

  let connectionInfo;
  let connectionId = event.requestContext.connectionId;

  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  try {
    connectionInfo = await callbackAPI
      .getConnection({ ConnectionId: connectionId })
      .promise();
  } catch (e) {
    return httpResponse(500, {
      service: logTag,
      error: e.message,
    });
  }

  await callbackAPI
    .postToConnection({
      ConnectionId: connectionId,
      Data:
        'Use the sendmessage route to send a message. Your info:' +
        JSON.stringify({ ...connectionInfo, connectionId }),
    })
    .promise();

  return httpResponse(200, {
    service: logTag,
    body:
      'Use the sendmessage route to send a message. Your info:' +
      JSON.stringify({ ...connectionInfo, connectionId }),
  });
};
