import ApiStack from './ApiStack';
import DDBStack from './DDBStack';
import CognitoStack from './CognitoStack';
import Config from './lib/Config';
import * as sst from '@serverless-stack/resources';

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  if (Config.profile !== 'help-app-154562047227') {
    throw new Error('Wrong account');
  }

  console.warn(`
    *****************************
    STAGE IS ${Config.stage}
    *****************************
  `);

  const ddbStack = new DDBStack(app, `ddb-stack`, {});
  const cognitoStack = new CognitoStack(app, `cognito-stack`, {});
  new ApiStack(app, `api-stack`, {
    userTableName: ddbStack.userTableName,
    requestTableName: ddbStack.requestTableName,
    cognitoUserPoolClientId: cognitoStack.userPoolClientId,
    cognitoUserPoolId: cognitoStack.userPoolId,
    stage: Config.stage,
  });
}
