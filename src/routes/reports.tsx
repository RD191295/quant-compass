import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/reports')({
  beforeLoad: () => { throw redirect({ to: '/app/reports', statusCode: 301 }); },
});
