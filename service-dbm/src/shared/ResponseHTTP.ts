import { ParcelUniversal } from './ParcelUniversal';

export interface ResponseHTTP {
  statusCode: number;
  headers: { [key: string]: string };
  body: ParcelUniversal;
}
