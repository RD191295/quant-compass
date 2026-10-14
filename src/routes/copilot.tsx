import { createFileRoute, redirect } from '@tanstack/react-router';

// Old address kept working after the workspace moved under /app.
export const Route = createFileRoute('/copilot')({
  beforeLoad: () => { throw redirect({ to: '/app/copilot', statusCode: 301 }); },
});
