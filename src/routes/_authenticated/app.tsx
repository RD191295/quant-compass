import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ResearchShell } from '@/components/research/shell';

export const Route = createFileRoute('/_authenticated/app')({
  component: () => <ResearchShell><Outlet /></ResearchShell>,
});
