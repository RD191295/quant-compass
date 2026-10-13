import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watchlists')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/watchlists"!</div>
}
