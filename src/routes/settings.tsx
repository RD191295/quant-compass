import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/research/pages';
import { pageHead, researchQuery } from '@/lib/research/api';
import { LoadingState, ResearchError } from '@/components/research/common';
export const Route = createFileRoute('/settings')({

head:()=>pageHead('Settings'),
loader: ({ context }) => context.queryClient.ensureQueryData(researchQuery),
pendingComponent: LoadingState, errorComponent: ResearchError,
component: SettingsPage,
});

