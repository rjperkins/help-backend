import * as sst from '@serverless-stack/resources';

interface DDBStackProps extends sst.StackProps {}

export default class DDBStack extends sst.Stack {
  requestTableName: string;
  requestTableArn: string;
  userTableName: string;
  userTableArn: string;

  constructor(scope: sst.App, id: string, props: DDBStackProps) {
    super(scope, id, props);

    const {} = props;

    // Create dynamoDB tables
    const requestTable = new sst.Table(this, `requests-table`, {
      fields: {
        requestId: 'string',
        userId: 'string',
        acceptedUserId: 'string' || undefined,
        request: 'string',
        category: 'string',
        location: 'string',
        photoS3Url: 'string' || undefined,
        timestamp: 'string',
      },
      primaryIndex: { partitionKey: 'requestId' },
      globalIndexes: {
        gs1: {
          partitionKey: 'acceptedUserId',
        },
        gs2: {
          partitionKey: 'userId',
        },
      },
    });

    this.requestTableName = requestTable.tableName;
    this.requestTableArn = requestTable.tableArn;

    const userTable = new sst.Table(this, `user-table`, {
      fields: {
        userId: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        rating: 'number',
        helpsGiven: 'number',
        helpsReceived: 'number',
        gender: 'string',
        address: 'string',
        birthdate: 'string',
      },
      primaryIndex: { partitionKey: 'userId' },
      globalIndexes: {
        gs1: {
          partitionKey: 'email',
        },
      },
    });

    this.userTableName = userTable.tableName;
    this.userTableArn = userTable.tableArn;

    // Outputs
    this.addOutputs({
      UserTableArn: userTable.tableArn,
      UserTableName: userTable.tableName,
      RequestTableArn: requestTable.tableArn,
      RequestTableName: requestTable.tableName,
    });
  }
}
