import type { H3Event } from 'h3';
import { incomingMessageToRequest } from '@trpc/server/adapters/node-http';

export function toWebRequest(event: H3Event): Request {
  // TODO: Prepare for h3 v2 https://github.com/unjs/h3/blob/main/MIGRATION.md#migration-guide-for-v1-to-v2
  if ('request' in event) {
    return event.request as Request;
  }

  // H3 v1 Web Request location
  if (event?.web?.request) {
    return event.web.request;
  }

  // Fallback to Node Request to web Request
  return incomingMessageToRequest(event.node.req, event.node.res, {
    maxBodySize: null,
  });
}
