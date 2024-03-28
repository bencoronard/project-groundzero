import { RequestHTTP } from '../entities/RequestHTTP';

export class Controller {
  static async route(request: RequestHTTP): Promise<void> {
    switch (request.method) {
      case 'GET':
        break;
    }
  }
}
