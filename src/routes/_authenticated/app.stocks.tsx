import { createFileRoute } from '@tanstack/react-router';
import { StockResearchPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/stocks')({
  validateSearch: (s: Record<string, unknown>): { symbol?: string } => ({ symbol: typeof s.symbol === 'string' ? s.symbol : undefined }),
  head: () => pageHead('Stock Research'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: StockRoute,
});

function StockRoute() {
  const { symbol } = Route.useSearch();
  return <StockResearchPage key={symbol} symbol={symbol} />;
}
