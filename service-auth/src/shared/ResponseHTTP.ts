import { IParcel, Parcel } from './Parcel';

export interface IResponseHTTP {
  statusCode: number;
  headers: { [key: string]: string };
  body: IParcel;
}

export class ResponseHTTP {
  private statusCode: number;
  private headers: { [key: string]: string };
  private body: Parcel;

  constructor() {
    // Default statusCode
    this.statusCode = 200;
    // Default headers
    this.headers = { 'Content-Type': 'application/json' };
    // Default body
    this.body = new Parcel();
  }

  setStatus(value: number): this {
    // Set statusCode
    this.statusCode = value;
    return this;
  }
  setHeads(value: { [key: string]: string }): this {
    // Set headers
    this.headers = value;
    return this;
  }
  getBody(): Parcel {
    // Expose body
    return this.body;
  }

  seal(): IResponseHTTP {
    // Return all attribute values
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body.pack(),
    };
  }
}
