## Validation

tRPC works out-of-the-box with yup/superstruct/zod/myzod/custom validators.

### Input Validation

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

### Output Validation

```ts
// ~/server/trpc/index.ts
import { z } from 'zod'

export const router = trpc
  .router()
  .query('hello', {
    // validate output with Zod
    output: z.object({
      greeting: z.string()
    }),
    // expects return type of { greeting: string }
    resolve() {
      return {
        greeting: 'hello!',
      }
    },
  })
```

Learn more about input validation [here](https://trpc.io/docs/router#input-validation).
