import { Record } from './Record';

export interface RecordInteractor {
  createRecords(recordsToCreate: Record[]): Promise<string>;

  fetchRecords(
    fetchCriteria: Partial<Record>,
    fetchLimit?: number,
    fetchOffset?: number
  ): Promise<string>;

  updateRecords(
    updateCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<string>;

  deleteRecords(
    deleteCriteria: Partial<Record>,
    deleteOffset?: number
  ): Promise<string>;
}
