interface Datum {
  field1: any;
  field2: any;
  field3: any;
  field4: any;
}

const data: { [key: string]: any } = {
  // field1: 1,
  field2: 'John',
  field3: 'Doe',
  // field4: true,
  limit: 30,
  offset: 5,
};

const excludeAttributes = ['limit', 'offset'];

const abc: Partial<Datum> = Object.keys(data).reduce((acc, key) => {
  const field = key as keyof Datum;
  console.log(acc);
  if (!excludeAttributes.includes(key)) {
    acc[field] = data[key];
  }
  return acc;
}, {} as Partial<Datum>);

console.log(abc);

console.log('End of execution');
