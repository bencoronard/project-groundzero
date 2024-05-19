import axios from 'axios';
import { Dispatcher } from '../shared/Dispatcher';
import { Parcel, IParcel } from '../shared/Parcel';

export class AxiosDispatcher implements Dispatcher {
  constructor() {}

  async dispatchInternal(
    route: { url: string; method: string },
    packet: { [key: string]: any },
    authorization?: { token: string }
  ): Promise<IParcel> {
    // Construct headers
    const heads = authorization
      ? {
          Authorization: `Bearer ${authorization.token}`,
          'Content-Type': 'application/json',
        }
      : undefined;
    // Initialize response
    let response: IParcel = new Parcel().pack();
    try {
      // Route requests based on method
      switch (route.method.toUpperCase()) {
        case 'GET':
          // Execute Get request and assign result to payload
          await axios
            .get(route.url, {
              params: packet,
              headers: heads,
            })
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
            .post(route.url, packet, { headers: heads })
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
            .put(route.url, packet, { headers: heads })
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
            .delete(route.url, { params: packet, headers: heads })
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
    } catch (error) {
      // Set error response
      response.isError = true;
      response.description = 'Error message';
      response.payload = (error as Error).message;
    }
    // Send response
    return response;
  }

  async dispatchExternal(
    route: { url: string; method: string },
    packet: { [key: string]: any },
    authorization?: { token: string }
  ): Promise<IParcel> {
    // Construct headers
    const heads = authorization
      ? {
          Authorization: `Bearer ${authorization.token}`,
          'Content-Type': 'application/json',
        }
      : undefined;
    // Initialize response
    const response: Parcel = new Parcel();
    try {
      // Route requests based on method
      switch (route.method.toUpperCase()) {
        case 'GET':
          // Execute Get request and assign result to payload
          await axios
            .get(route.url, {
              params: packet,
              headers: heads,
            })
            .then((res) => {
              response.setPayload(res.data);
            })
            .catch((err) => {
              response
                .setError(true)
                .setDesc('Error response')
                .setPayload(err.response.data);
            });
          break;

        case 'POST':
          // Execute Post request and assign result to payload
          await axios
            .post(route.url, packet, { headers: heads })
            .then((res) => {
              response.setPayload(res.data);
            })
            .catch((err) => {
              response
                .setError(true)
                .setDesc('Error response')
                .setPayload(err.response.data);
            });
          break;

        case 'PUT':
          // Execute Put request and assign result to payload
          await axios
            .put(route.url, packet, { headers: heads })
            .then((res) => {
              response.setPayload(res.data);
            })
            .catch((err) => {
              response
                .setError(true)
                .setDesc('Error response')
                .setPayload(err.response.data);
            });
          break;

        case 'DELETE':
          // Execute Delete request and assign result to payload
          await axios
            .delete(route.url, { params: packet, headers: heads })
            .then((res) => {
              response.setPayload(res.data);
            })
            .catch((err) => {
              response
                .setError(true)
                .setDesc('Error response')
                .setPayload(err.response.data);
            });
          break;

        default:
          // Request method out of scope
          throw new Error('Dispatch method out of scope');
      }
    } catch (error) {
      // Set error response
      response
        .setError(true)
        .setDesc('Error message')
        .setPayload((error as Error).message);
    }
    // Send response
    return response.pack();
  }
}
