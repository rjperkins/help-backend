export enum Stage {
  Development = 'development',
  Production = 'production',
}

export default class Config {
  static get profile() {
    return process.env.AWS_PROFILE;
  }
}
