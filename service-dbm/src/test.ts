import { AxiosDispatcher } from './detachables/AxiosDispatcher';
import dotenv from 'dotenv';
import path from 'path';
import { IParcel } from './shared/Parcel';

dotenv.config({ path: path.resolve(__dirname, '.env') });
const PORT = process.env.PORT;
const baseUrl = `http://localhost:${PORT}/records`;

const dispatcher = new AxiosDispatcher();

const queryParams: { [key: string]: any } = {
  field4: 'TH',
  limit: 20,
  offset: 0,
};

const updateData = {
  match: { field4: 'TH' },
  update: { field3: 'Sawasdee' },
};

// const updateData = {
//   match: { field4: 'TH' },
//   update: {},
// };

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
  let operationResult: IParcel;

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'POST' },
    postData
  );
  console.log('Response:\n', operationResult);

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'GET' },
    queryParams
  );
  console.log('Response:\n', operationResult);

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'PUT' },
    updateData
  );
  console.log('Response:\n', operationResult);

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'GET' },
    queryParams
  );
  console.log('Response:\n', operationResult);

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'DELETE' },
    queryParams
  );
  console.log('Response:\n', operationResult);

  operationResult = await dispatcher.dispatchInternal(
    { url: baseUrl, method: 'GET' },
    queryParams
  );
  console.log('Response:\n', operationResult);
}
