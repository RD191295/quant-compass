import { createFileRoute } from '@tanstack/react-router';
import { LabPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/lab')({
  head: () => pageHead('Factor Research Lab'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: LabPage,
});
