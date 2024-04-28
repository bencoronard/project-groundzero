import axios from 'axios';
import { Dispatcher } from '../shared/Dispatcher';
import { ParcelUniversal } from '../shared/ParcelUniversal';

export class AxiosDispatcher implements Dispatcher {
  constructor() {}

  async dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<ParcelUniversal> {
    let response: ParcelUniversal = { isError: true, payload: null };
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
      return response;
    } catch (error) {
      // Formulate return payload when error occurs
      response.description = 'Error message';
      response.payload = (error as Error).message;
      return response;
    }
  }
}
