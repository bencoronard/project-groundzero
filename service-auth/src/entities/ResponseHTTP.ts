export interface ResponseHTTP {
  statusCode: number;
  headers: { [key: string]: string };
  body: any;
}
