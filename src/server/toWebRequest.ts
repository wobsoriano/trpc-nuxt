import type { H3Event } from 'h3';
import { toWebRequest as toWebRequestOriginal } from 'h3';

export function toWebRequest(event: H3Event): Request {
  // TODO: Prepare for h3 v2 https://github.com/unjs/h3/blob/main/MIGRATION.md#migration-guide-for-v1-to-v2
  if ('request' in event) {
    return event.request as Request;
  }

  return toWebRequestOriginal(event);
}
