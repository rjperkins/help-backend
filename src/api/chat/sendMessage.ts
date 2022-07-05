import ConnectionService from '../../dynamodb/connections/Service';
import debug from 'debug';
import AWS from 'aws-sdk';
import { httpResponse } from '../../lib/utils/httpResponse';

const logTag = 'send-message-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);
const debugError = debug(`ws-api:error:${logTag}`);

export const handler = async (event: any) => {
  debugVerbose('event %j', event);

  let connections;
  try {
    connections = await ConnectionService.getConnections();
  } catch (err) {
    return {
      statusCode: 500,
      error: err.message,
    };
  }
  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  const message = JSON.parse(event.body).message;
  debugVerbose('message %s', message);

  const sendMessages = connections.map(async ({ connectionId }) => {
    if (connectionId === event.requestContext.connectionId) {
      try {
        await callbackAPI
          .postToConnection({ ConnectionId: connectionId, Data: message })
          .promise();
      } catch (e) {
        debugError('error %s', e.message);
      }
    }
  });

  try {
    await Promise.all(sendMessages);
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
