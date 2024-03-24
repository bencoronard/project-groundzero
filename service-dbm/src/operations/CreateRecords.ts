import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class CreateRecords {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(recordsToCreate: Record[]): Promise<Record[]> {
    const recordBundle: Record[] = processRecords(recordsToCreate);
    return await this.recordRepository.createEntries(recordBundle);
  }
}

function processRecords(records: Record[]): Record[] {
  const processedRecords: Record[] = [];
  records.forEach((record) => {
    processedRecords.push({
      field1: record.field1 + 'xxFF1',
      field2: record.field2 + 'xxFF2',
      field3: record.field3 + 'xxFF3',
      field4: record.field4 + 'xxFF4',
    });
  });
  return processedRecords;
}
