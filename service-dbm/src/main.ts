import { Record } from './entities/Record';
import { InMemoryStorage } from './detachable/InMemoryStorage';
import { CreateRecords } from './operations/CreateRecords';
import { FetchRecords } from './operations/FetchRecords';
import { UpdateRecords } from './operations/UpdateRecords';
import { DeleteRecords } from './operations/DeleteRecords';

const db: InMemoryStorage = new InMemoryStorage();

const newData: Record[] = [
  {
    field1: '25',
    field2: 'Clover',
    field3: 'controller',
    field4: 'GB',
  },
  {
    field1: '26',
    field2: 'Shatter',
    field3: 'duelist',
    field4: null,
  },
  {
    field1: '27',
    field2: 'Joules',
    field3: 'sentinel',
    field4: null,
  },
];
const matchCriteria: Partial<Record> = { field4: 'US' };
// const updateData: Partial<Record> = { field4: 'Unknown' };

// const createRecords = new CreateRecords(db);
// const fetchRecords = new FetchRecords(db);
// const updateRecords = new UpdateRecords(db);
const deleteRecords = new DeleteRecords(db);

// const operationResult = createRecords.execute(newData);

// operationResult.then((result) => {
//   console.log(result);
//   db.showRecords();
// });

const operationResult = deleteRecords.execute(matchCriteria, 1);

operationResult.then((result) => {
  console.log(typeof result);
  console.log(result);
  db.showRecords();
});

console.log('Hello, world!');
