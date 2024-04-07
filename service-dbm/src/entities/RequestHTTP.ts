import { IRecord } from './Record';
export interface RequestHTTP {
  path: string;
  method: string;
  pathParams?: { [key: string]: string };
  queryParams?: { [key: string]: any };
  body?: { [key: string]: Partial<IRecord[]> };
}
