import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/settings')({
  beforeLoad: () => { throw redirect({ to: '/app/settings', statusCode: 301 }); },
});
