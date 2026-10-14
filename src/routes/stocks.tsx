import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/stocks')({
  beforeLoad: () => { throw redirect({ to: '/app/stocks', statusCode: 301 }); },
});
