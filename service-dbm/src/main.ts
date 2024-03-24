import { InMemoryStorage } from './detachable/InMemoryStorage';

const db: InMemoryStorage = new InMemoryStorage();

const myPromise = db.readEntries({ field4: 'US' });

myPromise.then((result) => {
  console.log(result);
  console.log(typeof result);
  if (result) {
    console.log(result[0]);
  }
});
