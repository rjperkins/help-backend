import ConnectionService from '../../dynamodb/connections/Service';
import { ChatService, Chat } from '../../dynamodb/chat';
import debug from 'debug';
import AWS from 'aws-sdk';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import { base64Ids } from '../../lib/utils';
import { QueryResponse } from 'dynamoose/dist/DocumentRetriever';

const logTag = 'send-message-handler';
const debugVerbose = debug(`ws-api:verbose:${logTag}`);
const debugError = debug(`ws-api:error:${logTag}`);

export const main = async (event: any): Promise<HttpResponse> => {
  debugVerbose('event', event);
  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  const body = JSON.parse(event.body);

  // The person who sent the message must always be userId1
  const { message, senderId, receiverId } = body;

  const chatId = base64Ids(senderId, receiverId);

  let connections;
  let chat: Chat = { messages: [] } as any;
  try {
    connections = await ConnectionService.getConnections();
    const entry: QueryResponse<Chat> = await ChatService.getChat(
      senderId,
      receiverId
    );

    chat = entry[0];

    if (!chat) {
      throw new Error('Chat not found.');
    }

    const connection = connections.find((connection) => {
      return (
        connection.chatId === chatId &&
        connection.connectionId !== event.requestContext.connectionId
      );
    });

    await callbackAPI
      .postToConnection({
        ConnectionId: event.requestContext.connectionId,
        Data: JSON.stringify(message),
      })
      .promise();
    if (connection) {
      await callbackAPI
        .postToConnection({
          ConnectionId: connection.connectionId,
          Data: JSON.stringify(message),
        })
        .promise();
    }

    const newMessage = {
      text: message.text,
      userId: message.user._id,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = chat?.messages
      ? [...JSON.parse(chat?.messages), newMessage]
      : [newMessage];

    await ChatService.updateChatById(chat.id, {
      messages: JSON.stringify(updatedMessages),
    });

    return httpResponse(200, {
      service: logTag,
      body: updatedMessages,
    });
  } catch (e) {
    debugError('error %s', e);
    return httpResponse(e.statusCode, {
      service: logTag,
      error: e,
    });
  }
};
