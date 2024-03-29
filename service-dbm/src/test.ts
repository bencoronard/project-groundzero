interface Datum {
  field1: any;
  field2: any;
  field3: any;
  field4: any;
}

const repository: Datum[] = [];
const data = {
  // field1: 1,
  // field2: 'John',
  // field3: 'Doe',
  // field4: true,
  limit: 30,
  offset: 5,
};

try {
  const result = data;
  console.log(result);
} catch {
  console.log('Error!!!');
}
