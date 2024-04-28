export interface IAuthorization {
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

export class Authorization {
  static user() {
    // Permit basic access
    const permissions: IAuthorization = {
      service1: {
        operation1: false,
      },
      service2: {
        operation1: false,
        operation2: false,
      },
      service3: {
        operation1: true,
        operation2: true,
        operation3: true,
      },
    };
    // Return permissions
    return permissions;
  }

  static superUser() {
    // Permit elevated access
    const permissions: IAuthorization = {
      service1: {
        operation1: false,
      },
      service2: {
        operation1: true,
        operation2: true,
      },
      service3: {
        operation1: true,
        operation2: true,
        operation3: true,
      },
    };
    // Return permissions
    return permissions;
  }

  static apexUser() {
    // Permit full access
    const permissions: IAuthorization = {
      service1: {
        operation1: true,
      },
      service2: {
        operation1: true,
        operation2: true,
      },
      service3: {
        operation1: true,
        operation2: true,
        operation3: true,
      },
    };
    // Return permissions
    return permissions;
  }
}
