import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';

export class FetchRecord {
  private recordRepository: RecordRepository;
  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }
}
