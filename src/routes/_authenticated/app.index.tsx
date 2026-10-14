import { createFileRoute } from '@tanstack/react-router';
import { MarketOverview } from '@/components/research/overview';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/')({
  head: () => pageHead('Market Overview'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: MarketOverview,
});
