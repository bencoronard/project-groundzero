import axios from 'axios';
const baseUrl = 'http://localhost:3000/records';

// import { MySQLStorage } from './detachables/MySQLStorage';
// import { RequestHTTP } from './entities/RequestHTTP';
// import { ResponseHTTP } from './entities/ResponseHTTP';
// import { Interactor } from './operators/Interactor';

// const config = {
//   host: 'localhost',
//   user: 'root',
//   password: '1234',
//   database: 'valorant',
// };
// const table = 'agents';

// const db = new MySQLStorage(config, table);
// const interactor = new Interactor(db);

const queryParams = {
  // field1: 'abc',
  // field2: 'def',
  field3: 'duelist',
  field4: 'KR',
  limit: 100,
  offset: 0,
};

const data = {
  records: [
    {
      field1: 500,
      field2: 'John',
      field3: 'Doe',
      field4: 'TH',
    },
    {
      field1: 501,
      field2: 'James',
      field3: 'Dean',
      field4: 'UK',
    },
    {
      field1: 502,
      field2: 'Jack',
      field3: 'Dawn',
      field4: 'GG',
    },
    {
      field1: 504,
      field2: 'Levi',
      field3: 'Strauss',
      field4: 'LV',
    },
  ],
};

// const response = execute.fetchRecords(queryParams);

// let response = db.readEntries(
//   { field3: 'controller' },
//   queryParams.limit,
//   queryParams.offset
// );
// response
//   .then((result) => {
//     console.log(result);
//     console.log('End of query');
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('End of error');
//   });

// response = db.createEntries([
//   {
//     field1: 1,
//     field2: 'George',
//     field3: 'initiator',
//     field4: 'Hello',
//   },
// ]);
// response
//   .then((result) => {
//     console.log(result);
//     console.log('End of query');
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('End of error');
//   });

axios
  .post(baseUrl, data)
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

axios
  .get(baseUrl, { params: queryParams })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
