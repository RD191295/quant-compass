import { createFileRoute } from '@tanstack/react-router';
import { StockResearchPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';
export const Route = createFileRoute('/stocks')({
validateSearch: (search: Record<string, unknown>) => ({ symbol: typeof search.symbol === "string" ? search.symbol : "RELIANCE" }),
head:()=>pageHead('Stock Research'),
loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
pendingComponent: LoadingState, errorComponent: ResearchError,
component: StockRoute,
});
function StockRoute() { const {symbol} = Route.useSearch(); return <StockResearchPage symbol={symbol}/>; }
