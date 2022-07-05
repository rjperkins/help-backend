import AWS from 'aws-sdk';

export const handler = async (event: any) => {
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
    throw new Error(e.message);
  }

  await callbackAPI
    .postToConnection({
      ConnectionId: connectionId,
      Data:
        'Use the sendmessage route to send a message. Your info:' +
        JSON.stringify({ ...connectionInfo, connectionId }),
    })
    .promise();

  return {
    statusCode: 200,
  };
};
