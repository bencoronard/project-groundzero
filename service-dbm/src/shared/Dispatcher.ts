import { IParcel } from './Parcel';

export interface Dispatcher {
  dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<IParcel>;
}
