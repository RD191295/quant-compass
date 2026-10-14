import { createFileRoute } from '@tanstack/react-router';
import { ReportsPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/reports')({
  head: () => pageHead('Research Reports'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: ReportsPage,
});
