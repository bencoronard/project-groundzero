import { RecordInteractor } from '../entities/RecordInteractor';
import { RequestHTTP } from '../entities/RequestHTTP';

export class Controller {
  private recordInteractor: RecordInteractor;
  constructor(injectedInteractor: RecordInteractor) {
    this.recordInteractor = injectedInteractor;
  }
  async route(request: RequestHTTP): Promise<string> {
    let response: string = 'Invalid request';
    switch (request.method) {
      case 'POST':
        if (request.body) {
          try {
            // response = await this.recordInteractor.createRecords(request.body.records);
          } catch {
            response = 'Could not insert records';
          }
        }
        break;
    }
    return response;
  }
}
