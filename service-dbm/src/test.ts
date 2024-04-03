// import axios from 'axios';

// // Define the base URL and query parameters
// const baseUrl = 'http://localhost:3000/records';
// const queryParams = {
//   // field1: 'abc',
//   // field2: 'def',
//   // field3: 'duelist',
//   field4: 'US',
//   offset: 0,
// };

// const data = { match: { field2: 'Chamber' }, update: { field4: 'Kingdom' } };

// // Use axios to send the GET request with query parameters
// axios
//   .put(baseUrl, data)
//   .then((response) => {
//     console.log('Response:', response);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

let conditions = 'column1 = ? AND column2 = ? AND ';
console.log(conditions);

conditions = conditions.slice(0, -5);
console.log(conditions);
