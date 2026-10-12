import { createFileRoute } from '@tanstack/react-router';
import { ScreenerPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';
export const Route = createFileRoute('/screener')({

head:()=>pageHead('Equity Screener'),
loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
pendingComponent: LoadingState, errorComponent: ResearchError,
component: ScreenerPage,
});

