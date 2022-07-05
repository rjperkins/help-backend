import { createHash } from 'crypto';

export const base64Ids = (id1: string, id2: string) => {
  const md5 = createHash('md5');
  const id = [id1, id2].sort().join('-');
  md5.update(id);

  return md5.digest('base64');
};
