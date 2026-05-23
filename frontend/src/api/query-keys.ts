import type { JournalFilters } from '../types';

export const queryKeys = {
  workTypes: ['work-types'] as const,
  journalEntries: (filters: JournalFilters) =>
    ['journal-entries', filters] as const,
};
