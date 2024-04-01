import { Request } from 'express';
import { Record } from '../entities/Record';
import { RequestHTTP } from '../entities/RequestHTTP';

export class ExpressHTTP implements RequestHTTP {
  public path: string;
  public method: string;
  public pathParams?: { [key: string]: string };
  public queryParams?: { [key: string]: any };
  public body?: { [key: string]: Record[] };

  constructor(request: Request) {
    this.path = request.path;
    this.method = request.method;
    this.pathParams = request.params;
    this.queryParams = request.query;
    this.body = request.body;
  }
}
