import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/screener')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/screener"!</div>
}
