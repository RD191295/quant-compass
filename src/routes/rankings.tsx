import { createFileRoute } from '@tanstack/react-router';
import { RankingsPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';
export const Route = createFileRoute('/rankings')({

head:()=>pageHead('Factor Rankings'),
loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
pendingComponent: LoadingState, errorComponent: ResearchError,
component: RankingsPage,
});

