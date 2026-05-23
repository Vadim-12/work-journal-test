import { apiClient } from './client';
import type { JournalEntry, JournalFilters, WorkType } from '../types';

export interface JournalEntryPayload {
  performedAt: string;
  workTypeId: number;
  volume: number;
  executorName: string;
}

export const journalApi = {
  getWorkTypes: () =>
    apiClient.get<WorkType[]>('/work-types').then((r) => r.data),

  getJournalEntries: (filters: JournalFilters) =>
    apiClient
      .get<JournalEntry[]>('/journal-entries', {
        params: {
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          sort: filters.sort,
        },
      })
      .then((r) => r.data),

  createJournalEntry: (data: JournalEntryPayload) =>
    apiClient.post<JournalEntry>('/journal-entries', data).then((r) => r.data),

  updateJournalEntry: (id: number, data: Partial<JournalEntryPayload>) =>
    apiClient
      .patch<JournalEntry>(`/journal-entries/${id}`, data)
      .then((r) => r.data),

  deleteJournalEntry: (id: number) =>
    apiClient.delete<{ success: boolean }>(`/journal-entries/${id}`),
};
