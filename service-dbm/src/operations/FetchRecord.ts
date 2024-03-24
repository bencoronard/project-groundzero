import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class FetchRecord {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(
    fetchCriteria: Partial<Record>,
    fetchLimit?: number,
    fetchOffset?: number
  ): Promise<Record[] | null> {
    return await this.recordRepository.readEntries(
      fetchCriteria,
      fetchLimit,
      fetchOffset
    );
  }
}
