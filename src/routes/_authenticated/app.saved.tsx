import { createFileRoute } from '@tanstack/react-router';
import { SavedResearchPage } from '@/components/account/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/saved')({
  head: () => pageHead('Saved Research'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: SavedResearchPage,
});
