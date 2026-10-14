import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/account/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/settings')({
  head: () => pageHead('Settings'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: SettingsPage,
});
