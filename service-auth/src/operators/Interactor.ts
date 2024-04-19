import { Dispatcher } from '../entities/Dispatcher';
import { UserInteractor } from '../entities/UserInteractor';

export class Interactor implements UserInteractor {
  private dispatcher: Dispatcher;
  constructor(injectedDispatcher: Dispatcher) {
    this.dispatcher = injectedDispatcher;
  }
}
