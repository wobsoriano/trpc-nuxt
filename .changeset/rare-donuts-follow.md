---
"trpc-nuxt": patch
---

Introduce `getMutationKey` to extract the mutation key for a procedure.

Usage:

```ts
import { getMutationKey } from 'trpc-nuxt/client';

const mutationKey = getMutationKey($client.todo.addTodo);
console.log(mutationKey);
````
