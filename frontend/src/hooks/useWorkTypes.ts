import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../api/journal-api';
import { queryKeys } from '../api/query-keys';

export function useWorkTypes() {
  return useQuery({
    queryKey: queryKeys.workTypes,
    queryFn: journalApi.getWorkTypes,
  });
}
