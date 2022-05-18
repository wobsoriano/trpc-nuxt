## Validation

tRPC works out-of-the-box with yup/superstruct/zod/myzod/custom validators. Learn more about input validation [here](https://trpc.io/docs/router#input-validation).

```ts
// ~/server/trpc/index.ts
import { z } from 'zod'

export const router = trpc
  .router()
  .mutation('createUser', {
    // validate input with Zod
    input: z.object({
      name: z.string().min(5)
    }),
    async resolve(req) {
      // use your ORM of choice
      return await UserModel.create({
        data: req.input,
      })
    },
  })
```
