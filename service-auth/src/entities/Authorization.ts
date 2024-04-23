export interface Authorization {
  database: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}
