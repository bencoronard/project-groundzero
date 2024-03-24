import { Record } from './Record';
export interface RecordRepository {
  createEntries(records: Record[]): Promise<Record[]>;
  readEntries(
    match: Partial<Record>,
    limit?: number,
    offset?: number
  ): Promise<Record[] | null>;
  updateEntries(
    match: Partial<Record>,
    update: Partial<Record>
  ): Promise<Record[] | null>;
  deleteEntries(
    match: Partial<Record>,
    offset?: number
  ): Promise<Record[] | null>;
}
