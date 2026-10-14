import { createFileRoute } from '@tanstack/react-router';
import { OptionsPage } from '@/components/account/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/options')({
  head: () => pageHead('Options Intelligence'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: OptionsPage,
});
