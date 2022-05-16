import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

// Code.
export enum Stage {
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export default class Config {
  public static get account(): string {
    return process.env.ACCOUNT || '';
  }

  public static get stage(): Stage {
    return (process.env.STAGE as Stage) || Stage.Test;
  }

  public static get region(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  public static get cognitoUserPoolId(): string {
    return process.env.COGNITO_USER_POOL_ID || '';
  }

  public static get cognitoClientId(): string {
    return process.env.COGNITO_USER_POOL_CLIENT_ID || '';
  }

  public static get userTableName(): string {
    return process.env.USER_TABLE_NAME || '';
  }

  public static get requestTableName(): string {
    return process.env.REQUEST_TABLE_NAME || '';
  }
}
