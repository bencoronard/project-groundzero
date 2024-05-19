import { IParcel } from './Parcel';

export interface Dispatcher {
  dispatchInternal(
    route: { url: string; method: string },
    packet: { [key: string]: any },
    authorization?: { token: string }
  ): Promise<IParcel>;

  dispatchExternal(
    route: { url: string; method: string },
    packet: { [key: string]: any },
    authorization?: { token: string }
  ): Promise<IParcel>;
}
