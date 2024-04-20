export interface RequestHTTP {
  path: string;
  method: string;
  pathParams?: { [key: string]: any };
  queryParams?: { [key: string]: any };
  body?: { [key: string]: any };
}
