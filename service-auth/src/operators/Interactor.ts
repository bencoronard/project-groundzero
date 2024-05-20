import { UserInteractor } from '../entities/UserInteractor';
import { CacheStorage } from '../shared/CacheStorage';

export class Interactor implements UserInteractor {
  private sessionStore: CacheStorage;

  constructor(injectedSessionStore: CacheStorage) {
    this.sessionStore = injectedSessionStore;
  }
}
