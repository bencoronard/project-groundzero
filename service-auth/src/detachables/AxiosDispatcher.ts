import axios from 'axios';
import { Dispatcher } from '../entities/Dispatcher';
import { ParcelUniversal } from '../shared/ParcelUniversal';

export class AxiosDispatcher implements Dispatcher {
  constructor() {}

  async dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<ParcelUniversal> {
    // Initialize result parcel
    const parcel: ParcelUniversal = { isError: false, payload: null };
    try {
      // Route requests based on method
      switch (route.method.toUpperCase()) {
        case 'GET':
          // Execute Get request and assign result to payload
          parcel.payload = await axios.get(route.url, { params: packet });
          break;
        case 'POST':
          // Execute Post request and assign result to payload
          parcel.payload = await axios.post(route.url, packet);
          break;
        case 'PUT':
          // Execute Put request and assign result to payload
          parcel.payload = await axios.put(route.url, packet);
          break;
        case 'DELETE':
          // Execute Delete request and assign result to payload
          parcel.payload = await axios.delete(route.url, { params: packet });
          break;
        default:
          // Request method out of scope
          throw new Error('Invalid request method');
      }
    } catch (error) {
      // Formulate return payload when error occurs
      parcel.isError = true;
      parcel.description = 'Error message';
      parcel.payload = (error as Error).message;
    }
    // Return payload
    return parcel;
  }
}
