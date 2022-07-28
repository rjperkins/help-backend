export const httpResponse = (statusCode: number, body: any): HttpResponse => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
};

export type HttpResponse = {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string;
};
