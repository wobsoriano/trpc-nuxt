import type { H3Event } from 'h3'

export async function toWebRequest(event: H3Event) {
  // TODO: Prepare for h3 v2 https://github.com/unjs/h3/blob/main/MIGRATION.md#migration-guide-for-v1-to-v2
  if ('request' in event) {
    return event.request as Request
  }

  // H3 v1 web request location
  if (event?.web?.request) {
    return event.web?.request
  }

  // Fallback to Node request to web request
  const { incomingMessageToRequest } = await import('@trpc/server/adapters/node-http')
  return incomingMessageToRequest(event.node.req, event.node.res, {
    maxBodySize: null
  })
}
