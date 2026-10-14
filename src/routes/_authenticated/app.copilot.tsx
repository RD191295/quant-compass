import { createFileRoute } from '@tanstack/react-router';
import { CopilotPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';

export const Route = createFileRoute('/_authenticated/app/copilot')({
  head: () => pageHead('AI Research Copilot'),
  loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
  pendingComponent: LoadingState,
  errorComponent: ResearchError,
  component: CopilotPage,
});
