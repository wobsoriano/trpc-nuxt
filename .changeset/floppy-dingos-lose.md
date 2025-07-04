---
"trpc-nuxt": minor
---

Allow advanced response handling on server & client.

It's now possible to handle the h3 event with e.g. `sendRedirect()` inside of a tRPC procedure, like you would inside a Nitro event handler.

`http*Link()` adapters now have a `fetchOptions` parameter, allowing to pass options to the `ofetch` instance used internally. This can be useful for intercepting requests/responses on the client side.
