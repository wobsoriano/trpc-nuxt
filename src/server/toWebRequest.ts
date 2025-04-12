import type { H3Event } from 'h3';
import { getRequestURL, getRequestWebStream } from 'h3';

export function toWebRequest(event: H3Event): Request {
  // TODO: Prepare for h3 v2 https://github.com/unjs/h3/blob/main/MIGRATION.md#migration-guide-for-v1-to-v2
  if ('request' in event) {
    return event.request as Request;
  }

  return toWebRequestOriginal(event);
}

// Copied from https://github.com/unjs/h3/blob/89265ec4cc37f65f5bf903c2b993fde3e6e69048/src/utils/request.ts#L351
function toWebRequestOriginal(event: H3Event) {
  return event.web?.request || new Request(getRequestURL(event), {
    duplex: 'half',
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event),
  });
}
