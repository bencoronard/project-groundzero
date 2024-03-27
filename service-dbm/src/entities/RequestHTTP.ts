export interface RequestHTTP {
  path: string;
  method: string;
  pathParams?: { [key: string]: string };
  queryParams?: { [key: string]: any };
  body?: any;
}
