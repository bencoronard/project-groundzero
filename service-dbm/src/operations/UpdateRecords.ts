import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class UpdateRecords {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(
    updateCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<string> {
    const updatedRecords: Record[] = await this.recordRepository.updateEntries(
      updateCriteria,
      updateValues
    );
    return `Number of records updated: ${updatedRecords.length}`;
  }
}
