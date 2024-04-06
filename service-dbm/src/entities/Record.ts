export interface IRecord {
  field1: any;
  field2: any;
  field3: any;
  field4: any;
}

export class Record {
  static async parseRecords(input: any[]): Promise<IRecord[]> {
    try {
      const parsedRecords: IRecord[] = [];
      for (const item of input) {
        if (
          typeof item.field1 === 'number' &&
          typeof item.field2 === 'string' &&
          typeof item.field3 === 'string' &&
          typeof item.field4 === 'string'
        ) {
          parsedRecords.push(item);
        } else {
          throw new Error('Could not parse inputs');
        }
      }
      return parsedRecords;
    } catch (error) {
      throw error;
    }
  }

  static async parseRecordPartial(input: {
    [key: string]: any;
  }): Promise<Partial<IRecord>> {
    try {
      const parsedRecordPartial: Partial<IRecord> = {};

      if (typeof input.field1 === 'number') {
        parsedRecordPartial.field1 = input.field1;
      }
      if (typeof input.field2 === 'string') {
        parsedRecordPartial.field2 = input.field2;
      }
      if (typeof input.field3 === 'string') {
        parsedRecordPartial.field3 = input.field3;
      }
      if (typeof input.field4 === 'string') {
        parsedRecordPartial.field4 = input.field4;
      }
      if (Object.keys(parsedRecordPartial).length === 0) {
        throw new Error('Could not parse inputs');
      } else {
        return parsedRecordPartial;
      }
    } catch (error) {
      throw error;
    }
  }

  static async processRecords(records: IRecord[]): Promise<IRecord[]> {
    try {
      const processedRecords: IRecord[] = [];
      records.forEach((record) => {
        processedRecords.push({
          field1: record.field1,
          field2: record.field2,
          field3: record.field3,
          field4: record.field4,
        });
      });
      return processedRecords;
    } catch {
      throw new Error('Could not process records');
    }
  }

  static getAttributes(): string[] {
    return ['field1', 'field2', 'field3', 'field4'];
  }
}
