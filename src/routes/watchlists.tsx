import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/watchlists')({
  beforeLoad: () => { throw redirect({ to: '/app/watchlists', statusCode: 301 }); },
});
