import axios from 'axios';
import { Dispatcher } from '../shared/Dispatcher';
import { Parcel, IParcel } from '../shared/Parcel';

export class AxiosDispatcher implements Dispatcher {
  constructor() {}

  async dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<IParcel> {
    // Initialize response
    let response: IParcel = new Parcel().pack();
    try {
      // Route requests based on method
      switch (route.method.toUpperCase()) {
        case 'GET':
          // Execute Get request and assign result to payload
          await axios
            .get(route.url, { params: packet })
            .then((res) => {
              response = res.data;
            })
            .catch((err) => {
              response = err.response.data;
            });

          break;

        case 'POST':
          // Execute Post request and assign result to payload
          await axios
            .post(route.url, packet)
            .then((res) => {
              response = res.data;
            })
            .catch((err) => {
              response = err.response.data;
            });
          break;

        case 'PUT':
          // Execute Put request and assign result to payload
          await axios
            .put(route.url, packet)
            .then((res) => {
              response = res.data;
            })
            .catch((err) => {
              response = err.response.data;
            });
          break;

        case 'DELETE':
          // Execute Delete request and assign result to payload
          await axios
            .delete(route.url, { params: packet })
            .then((res) => {
              response = res.data;
            })
            .catch((err) => {
              response = err.response.data;
            });
          break;

        default:
          // Request method out of scope
          throw new Error('Dispatch method out of scope');
      }
      // Return successful response
      return response;
    } catch (error) {
      // Set error response
      response.description = 'Error message';
      response.payload = (error as Error).message;
      // Return error response
      return response;
    }
  }
}
