import { InMemoryStorage } from './detachable/InMemoryStorage';

const db: InMemoryStorage = new InMemoryStorage();

console.log(db.showRecords()[0]);
