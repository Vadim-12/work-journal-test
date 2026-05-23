export interface WorkType {
  id: number;
  name: string;
  unit: string;
}

export interface JournalEntry {
  id: number;
  performedAt: string;
  volume: string;
  executorName: string;
  workTypeId: number;
  workType: WorkType;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryFormData {
  performedAt: string;
  workTypeId: number | '';
  volume: string;
  executorName: string;
}

export interface JournalFilters {
  dateFrom: string;
  dateTo: string;
  sort: 'asc' | 'desc';
}
