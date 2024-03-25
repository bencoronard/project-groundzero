import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class FetchRecords {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(
    fetchCriteria: Partial<Record>,
    fetchLimit?: number,
    fetchOffset?: number
  ): Promise<Record[]> {
    return await this.recordRepository.readEntries(
      fetchCriteria,
      fetchLimit,
      fetchOffset
    );
  }
}
