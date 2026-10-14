import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/screener')({
  beforeLoad: () => { throw redirect({ to: '/app/screener', statusCode: 301 }); },
});
