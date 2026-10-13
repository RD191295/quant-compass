import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lab"!</div>
}
