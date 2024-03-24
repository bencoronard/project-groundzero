import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class UpdateRecord {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async execute(
    updateCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<Record[] | null> {
    return await this.recordRepository.updateEntries(
      updateCriteria,
      updateValues
    );
  }
}
