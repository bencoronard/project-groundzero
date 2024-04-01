import axios from 'axios';

// Define the base URL and query parameters
const baseUrl = 'http://localhost:3000/records';
const queryParams = {
  field1: 'abc',
  field2: 'def',
  field3: 'ghi',
  field4: 'jkl',
  limit: 5,
  offset: 2,
};

// Use axios to send the GET request with query parameters
axios
  .get(baseUrl, { params: queryParams })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
