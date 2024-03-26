import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class DeleteRecords {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(
    deleteCriteria: Partial<Record>,
    deleteOffset?: number
  ): Promise<string> {
    const deletedRecords = await this.recordRepository.deleteEntries(
      deleteCriteria,
      deleteOffset
    );
    return `Number of records deleted: ${deletedRecords.length}`;
  }
}
