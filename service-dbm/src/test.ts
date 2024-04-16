import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const baseUrl = `http://localhost:${PORT}/records`;

const queryParams: { [key: string]: any } = {
  field4: 'TH',
  limit: 20,
  offset: 0,
};

const updateData = {
  match: { field4: 'TH' },
  update: { field3: 'Sawasdee' },
};

const postData = {
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
      field4: 'TH',
    },
    {
      field1: 502,
      field2: 'Jack',
      field3: 'Dawn',
      field4: 'TH',
    },
    {
      field1: 504,
      field2: 'Levi',
      field3: 'Strauss',
      field4: 'TH',
    },
  ],
};

test();

async function test() {
  await axios
    .post(baseUrl, postData)
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
  await axios
    .get(baseUrl, { params: queryParams })
    .then((response) => {
      console.log(`Response:\n`, response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
  await axios
    .put(baseUrl, updateData)
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
  await axios
    .get(baseUrl, { params: queryParams })
    .then((response) => {
      console.log(`Response:\n`, response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
  await axios
    .delete(baseUrl, { params: queryParams })
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
  await axios
    .get(baseUrl, { params: queryParams })
    .then((response) => {
      console.log(`Response:\n`, response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response.data);
    });
}
