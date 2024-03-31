interface Datum {
  field1: any;
  field2: any;
  field3: any;
  field4: any;
}

const sigma: Datum = {
  field1: 2,
  field2: 'Jack',
  field3: 'Daniel',
  field4: false,
};

let pi: Partial<Datum> = {};

const data: { [key: string]: any } = {
  // field1: 1,
  field2: 'John',
  field3: 'Doe',
  // field4: true,
  limit: 30,
  offset: 5,
};

Object.keys(data).reduce(
  (acc, key) => {
    const field = key as keyof Datum;
    console.log(acc);
    if (key in acc) {
      acc[field] = data[key];
    }
    return acc;
  },
  { field1: null, field2: null, field3: null, field4: null }
);

console.log('End of execution');
