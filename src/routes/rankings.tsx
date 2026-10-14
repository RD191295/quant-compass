import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/rankings')({
  beforeLoad: () => { throw redirect({ to: '/app/rankings', statusCode: 301 }); },
});
