import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi, type JournalEntryPayload } from '../api/journal-api';
import { queryKeys } from '../api/query-keys';

export function useJournalEntryMutations() {
  const queryClient = useQueryClient();

  const invalidateEntries = () =>
    queryClient.invalidateQueries({ queryKey: ['journal-entries'] });

  const create = useMutation({
    mutationFn: (data: JournalEntryPayload) =>
      journalApi.createJournalEntry(data),
    onSuccess: invalidateEntries,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<JournalEntryPayload>;
    }) => journalApi.updateJournalEntry(id, data),
    onSuccess: invalidateEntries,
  });

  const remove = useMutation({
    mutationFn: (id: number) => journalApi.deleteJournalEntry(id),
    onSuccess: invalidateEntries,
  });

  return { create, update, remove };
}
