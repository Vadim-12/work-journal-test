import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../api/journal-api';
import { queryKeys } from '../api/query-keys';
import type { JournalFilters } from '../types';

export function useJournalEntries(filters: JournalFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.journalEntries(filters),
    queryFn: () => journalApi.getJournalEntries(filters),
    enabled,
  });
}
