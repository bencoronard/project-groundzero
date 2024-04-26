import axios from 'axios';
import { Dispatcher } from '../entities/Dispatcher';
import { ParcelUniversal } from '../shared/ParcelUniversal';

export class AxiosDispatcher implements Dispatcher {
  constructor() {}

  async dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<ParcelUniversal> {
    const parcel: ParcelUniversal = { isError: false, payload: null };
    try {
      switch (route.method.toUpperCase()) {
        case 'GET':
          parcel.payload = await axios.get(route.url, { params: packet });
          break;
        case 'POST':
          parcel.payload = await axios.post(route.url, packet);
          break;
        case 'PUT':
          parcel.payload = await axios.put(route.url, packet);
          break;
        case 'DELETE':
          parcel.payload = await axios.delete(route.url, { params: packet });
          break;
        default:
          throw new Error('Invalid request method');
      }
    } catch (error) {
      parcel.isError = true;
      parcel.description = 'Error message';
      parcel.payload = (error as Error).message;
    }
    return parcel;
  }
}
