import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/copilot')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/copilot"!</div>
}
