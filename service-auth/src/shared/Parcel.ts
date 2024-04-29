export interface IParcel {
  isError: boolean;
  payload: any;
  description?: string;
}

export class Parcel {
  private isError: boolean;
  private description?: string;
  private payload: any;

  constructor() {
    // Default isError
    this.isError = true;
    // Default payload
    this.payload = null;
  }

  setError(value: boolean): this {
    // Set isError
    this.isError = value;
    return this;
  }
  setDesc(value: string): this {
    // Set description
    this.description = value;
    return this;
  }
  setPayload(value: any): this {
    // Set payload
    this.payload = value;
    return this;
  }
  pack(): IParcel {
    // Return all attribute values
    if (this.description) {
      // Attribute description is not empty
      return {
        isError: this.isError,
        description: this.description,
        payload: this.payload,
      };
    } else {
      // Attribute description is empty
      return {
        isError: this.isError,
        payload: this.payload,
      };
    }
  }
}
