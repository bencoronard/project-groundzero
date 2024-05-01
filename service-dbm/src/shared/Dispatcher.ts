import { IParcel } from './Parcel';

export interface Dispatcher {
  dispatchInternal(
    route: { url: string; method: string },
    authorization?: { token: string },
    packet?: { [key: string]: any }
  ): Promise<IParcel>;
  dispatchExternal(
    route: { url: string; method: string },
    authorization?: { token: string },
    packet?: { [key: string]: any }
  ): Promise<IParcel>;
}
