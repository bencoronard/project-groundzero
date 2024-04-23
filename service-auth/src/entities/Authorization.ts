export interface Authorization {
  // Ex.
  // database: {
  //   create: boolean;
  //   read: boolean;
  //   update: boolean;
  //   delete: boolean;
  // };

  service1: {
    operation1: boolean;
  };
  service2: {
    operation1: boolean;
    operation2: boolean;
  };
  service3: {
    operation1: boolean;
    operation2: boolean;
    operation3: boolean;
  };
}
