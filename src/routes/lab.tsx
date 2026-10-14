import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/lab')({
  beforeLoad: () => { throw redirect({ to: '/app/lab', statusCode: 301 }); },
});
