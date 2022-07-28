import ConnectionService from '../../dynamodb/connections/Service';
import debug from 'debug';
import AWS from 'aws-sdk';
import { httpResponse } from '../../lib/utils/httpResponse';
import { base64Ids } from '../../lib/utils';

const logTag = 'send-message-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);
const debugError = debug(`ws-api:error:${logTag}`);

export const main = async (event: any) => {
  debugVerbose('event', event);

  let connections;
  try {
    connections = await ConnectionService.getConnections();
  } catch (err) {
    return httpResponse(500, {
      service: logTag,
      error: err.message,
    });
  }
  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  const body = JSON.parse(event.body);

  const { message, userId1, userId2 } = body;

  const chatId = base64Ids(userId1, userId2);
  debugVerbose('message', message);
  debugVerbose('connections', connections);
  debugVerbose('chatId', chatId);

  const sendMessages = connections.map(async (connection) => {
    if (
      connection.chatId === chatId &&
      connection.connectionId !== event.requestContext.connectionId
    ) {
      console.log(12345);

      try {
        await callbackAPI
          .postToConnection({
            ConnectionId: event.requestContext.connectionId,
            Data: message,
          })
          .promise();
      } catch (e) {
        debugError('error %s', e.message);
      }
    }
  });

  try {
    const res = await Promise.all(sendMessages);
    debugVerbose('res', res);
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
