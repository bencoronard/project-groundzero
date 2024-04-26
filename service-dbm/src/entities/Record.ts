export interface IRecord {
  field1: any;
  field2: any;
  field3: any;
  field4: any;
}

export class Record {
  static async parseRecords(input: any[]): Promise<IRecord[]> {
    try {
      // Create record container
      const parsedRecords: IRecord[] = [];
      // Loop through each item in input
      for (const item of input) {
        // Check each item for completeness
        if (
          typeof item.field1 === 'number' &&
          typeof item.field2 === 'string' &&
          typeof item.field3 === 'string' &&
          typeof item.field4 === 'string'
        ) {
          // Push complete record into container
          parsedRecords.push(item);
        } else {
          // Incomplete record found
          throw new Error('Invalid or incomplete input records');
        }
      }
      // Return complete records
      return parsedRecords;
    } catch (error) {
      // Propagate errors thrown during record parsing
      throw error;
    }
  }

  static async parseRecordPartial(input: {
    [key: string]: any;
  }): Promise<Partial<IRecord>> {
    try {
      // Create empty record
      const parsedRecordPartial: Partial<IRecord> = {};
      // Check valid fields and append to partial record
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
      // Check if resulting partial record is empty
      if (Object.keys(parsedRecordPartial).length === 0) {
        // Resulting partial record is empty
        throw new Error('Invalid or incomplete input record');
      } else {
        // Return parsed partial record
        return parsedRecordPartial;
      }
    } catch (error) {
      // Propagate errors thrown during partial record parsing
      throw error;
    }
  }

  static async processRecords(records: IRecord[]): Promise<IRecord[]> {
    try {
      // Create empty record array
      const processedRecords: IRecord[] = [];
      // Loop through each record in input record array
      records.forEach((record) => {
        // Extract record fields and add to record array
        processedRecords.push({
          field1: record.field1,
          field2: record.field2,
          field3: record.field3,
          field4: record.field4,
        });
      });
      // Return processed record array
      return processedRecords;
    } catch {
      // Unsuccessful record processing
      throw new Error('Failed processing input records');
    }
  }

  static getAttributes(): string[] {
    // Return all record fields
    return ['field1', 'field2', 'field3', 'field4'];
  }
}
