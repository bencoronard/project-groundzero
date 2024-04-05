import { IRecord } from './Record';
export interface RecordRepository {
  createEntries(recordsToInsert: IRecord[]): Promise<IRecord[]>;

  readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit?: number,
    matchOffset?: number
  ): Promise<IRecord[]>;

  updateEntries(
    matchCriteria: Partial<IRecord>,
    updateValues: Partial<IRecord>
  ): Promise<IRecord[]>;

  deleteEntries(
    matchCriteria: Partial<IRecord>,
    matchOffset?: number
  ): Promise<IRecord[]>;
}
