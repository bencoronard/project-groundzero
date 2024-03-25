import { Record } from "../entities/Record";
import { RecordRepository } from "../entities/RecordRepository";

export class CreateRecords {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(recordsToCreate: Record[]): Promise<string> {
    const recordBundle: Record[] = processRecords(recordsToCreate);
    const insertedRecords = await this.recordRepository.createEntries(
      recordBundle
    );
    return `Number of records created: ${insertedRecords.length}`;
  }
}

function processRecords(records: Record[]): Record[] {
  const processedRecords: Record[] = [];
  records.forEach((record) => {
    processedRecords.push({
      field1: record.field1,
      field2: record.field2 + " xFF2",
      field3: record.field3 + " xFF3",
      field4: record.field4 + " xFF4",
    });
  });
  return processedRecords;
}
