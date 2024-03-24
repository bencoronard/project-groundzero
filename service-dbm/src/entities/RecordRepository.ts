import { Record } from './Record';
export interface RecordRepository {
  createEntries(recordsToInsert: Record[]): Promise<Record[]>;

  readEntries(
    matchCriteria: Partial<Record>,
    matchLimit?: number,
    matchOffset?: number
  ): Promise<Record[] | null>;

  updateEntries(
    matchCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<Record[] | null>;

  deleteEntries(
    matchCriteria: Partial<Record>,
    matchOffset?: number
  ): Promise<Record[] | null>;
}
