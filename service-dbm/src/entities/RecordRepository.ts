import { IRecord } from './Record';
export interface RecordRepository {
  createEntries(recordsToInsert: IRecord[]): Promise<number>;

  readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit?: number,
    matchOffset?: number
  ): Promise<IRecord[]>;

  updateEntries(
    matchCriteria: Partial<IRecord>,
    updateCriteria: Partial<IRecord>
  ): Promise<number>;

  deleteEntries(matchCriteria: Partial<IRecord>): Promise<number>;
}
