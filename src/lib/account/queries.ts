import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getWorkspace } from './account.functions';

export const workspaceQuery = queryOptions({ queryKey: ['workspace'], queryFn: () => getWorkspace(), staleTime: 30_000 });

/** Wraps a workspace mutation: refreshes workspace data on success and shows feedback. */
export function useWorkspaceMutation<TInput>(fn: (input: TInput) => Promise<unknown>, success?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => { void qc.invalidateQueries({ queryKey: workspaceQuery.queryKey }); if (success) toast.success(success); },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Something went wrong. Please try again.'),
  });
}
