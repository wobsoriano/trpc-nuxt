# Changelog

## 1.2.0

### Minor Changes

- ad98bae: Set minimum version to Node 20

## 1.1.0

### Minor Changes

- fa05744: Allow advanced response handling on server & client.

  It's now possible to handle the h3 event with e.g. `sendRedirect()` inside of a tRPC procedure, like you would inside a Nitro event handler.

  `http*Link()` adapters now have a `fetchOptions` parameter, allowing to pass options to the `ofetch` instance used internally. This can be useful for intercepting requests/responses on the client side.

### Patch Changes

- f2a8064: Bump h3 to 1.15.3

## 1.0.5

### Patch Changes

- 4edc91c: Use copy of H3's `toWebRequest`

## 1.0.4

### Patch Changes

- 4554340: Add missing subscription event types

## 1.0.3

### Patch Changes

- b37525d: `useMutation()` type improvements and added an option to specify a custom mutation key.

## 1.0.2

### Patch Changes

- 6aa07ee: Introduce `getMutationKey` to extract the mutation key for a procedure.

  Usage:

  ```ts
  import { getMutationKey } from "trpc-nuxt/client";

  const mutationKey = getMutationKey($client.todo.addTodo);
  console.log(mutationKey);
  ```

## 1.0.1

### Patch Changes

- a85d1d4: Custom links clean up and introduce custom `httpBatchStreamLink`

## 1.0.0

### Major Changes

- 9b16e5a: Official release of trpc-nuxt v1.0.0 with tRPC v11 support.

  See updated docs @ https://trpc-nuxt.vercel.app

## 0.11.1

### Patch Changes

- ec1d9bf: Next patch before major
- 4e02015: Initial next version
- 060a36e: - Migrate to `fetchRequestHandler` to support Fetch/Edge runtimes.
  - Remove most of internal tRPC imports
- a91a74c: Fix incorrect mutate input type
- 7c495c9: Use correct versions when installing
- c1101f2: Release next test

## 0.11.1-next.5

### Patch Changes

- ec1d9bf: Next patch before major

## 0.11.1-next.4

### Patch Changes

- 7c495c9: Use correct versions when installing

## 0.11.1-next.3

### Patch Changes

- 060a36e: - Migrate to `fetchRequestHandler` to support Fetch/Edge runtimes.
  - Remove most of internal tRPC imports

## 0.11.1-next.2

### Patch Changes

- a91a74c: Fix incorrect mutate input type

## 0.11.1-next.1

### Patch Changes

- c1101f2: Release next test

## 0.11.1-next.0

### Patch Changes

- 4e02015: Initial next version

## v0.10.15

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.14...v0.10.15)

### 🚀 Enhancements

- UseMutation composable ([f45957b](https://github.com/wobsoriano/trpc-nuxt/commit/f45957b))

### 📖 Documentation

- Add useMutation example ([93a27a6](https://github.com/wobsoriano/trpc-nuxt/commit/93a27a6))

### 🏡 Chore

- Add initial queryKey for useMutation ([13234b9](https://github.com/wobsoriano/trpc-nuxt/commit/13234b9))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.14

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.13...v0.10.14)

### 🚀 Enhancements

- GetQueryKey helper ([fc2c7f9](https://github.com/wobsoriano/trpc-nuxt/commit/fc2c7f9))

### 📖 Documentation

- Add basic mutation usage ([7896b95](https://github.com/wobsoriano/trpc-nuxt/commit/7896b95))
- Add getQueryKey usage ([3e34102](https://github.com/wobsoriano/trpc-nuxt/commit/3e34102))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.13

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.12...v0.10.13)

### 📖 Documentation

- Fix broken snippets ([0f1e5a5](https://github.com/wobsoriano/trpc-nuxt/commit/0f1e5a5))
- Prerender homepage ([02ff723](https://github.com/wobsoriano/trpc-nuxt/commit/02ff723))

### 📦 Build

- **deps:** Bump h3 to 1.8.2 ([cc41e52](https://github.com/wobsoriano/trpc-nuxt/commit/cc41e52))
- **deps:** Bump h3 to 1.9.0 ([894d999](https://github.com/wobsoriano/trpc-nuxt/commit/894d999))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))
- Nicolas Hedger <nicolas@hedger.ch>

## v0.10.12

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.11...v0.10.12)

### 🩹 Fixes

- Expect ofetch missing error response type ([8f9e398](https://github.com/wobsoriano/trpc-nuxt/commit/8f9e398))

### 💅 Refactors

- Explicitly copy headers to custom fetcher ([0fec55a](https://github.com/wobsoriano/trpc-nuxt/commit/0fec55a))

### 📖 Documentation

- Add response caching page ([9808375](https://github.com/wobsoriano/trpc-nuxt/commit/9808375))
- Fix missing title ([057c8f8](https://github.com/wobsoriano/trpc-nuxt/commit/057c8f8))
- Fix incorrect syntax ([230422b](https://github.com/wobsoriano/trpc-nuxt/commit/230422b))

### 📦 Build

- **deps:** Bump ofetch to 1.3.2 ([092e349](https://github.com/wobsoriano/trpc-nuxt/commit/092e349))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.11

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.10...v0.10.11)

### 🩹 Fixes

- Add missing useLazyQuery type ([299ae55](https://github.com/wobsoriano/trpc-nuxt/commit/299ae55))

### 📖 Documentation

- Bump @nuxt-themes/docus to 1.14.6 ([f7eeb10](https://github.com/wobsoriano/trpc-nuxt/commit/f7eeb10))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.10

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.9...v0.10.10)

### 🚀 Enhancements

- Add useLazyQuery composable ([93cb442](https://github.com/wobsoriano/trpc-nuxt/commit/93cb442))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.9

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.8...v0.10.9)

### 🚀 Enhancements

- Add custom query key option ([f2bcf9b](https://github.com/wobsoriano/trpc-nuxt/commit/f2bcf9b))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.8

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.7...v0.10.8)

### 💅 Refactors

- Use built-in getRequestURL from h3 instead of ufo ([252f610](https://github.com/wobsoriano/trpc-nuxt/commit/252f610))
- Use stand-alone getErrorShape ([3db0b31](https://github.com/wobsoriano/trpc-nuxt/commit/3db0b31))

### 📖 Documentation

- Add handler param description ([f86ebcd](https://github.com/wobsoriano/trpc-nuxt/commit/f86ebcd))

### 📦 Build

- **deps:** Bump h3 to 1.8.0 ([3a395a7](https://github.com/wobsoriano/trpc-nuxt/commit/3a395a7))
- Bump local deps ([dc317c2](https://github.com/wobsoriano/trpc-nuxt/commit/dc317c2))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.7

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.6...v0.10.7)

### 🩹 Fixes

- Make useQuery return data nullable ([120ebc5](https://github.com/wobsoriano/trpc-nuxt/commit/120ebc5))

### 📖 Documentation

- Update Server Side Calls docs ([1c638a8](https://github.com/wobsoriano/trpc-nuxt/commit/1c638a8))

### ❤️ Contributors

- Blechlawine <marczinser@gmx.de>
- Colonel-Sandvich

## v0.10.6

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.5...v0.10.6)

### 🏡 Chore

- **deps**:
  - Bump h3 to 1.7.1 &nbsp;-&nbsp; by @wobsoriano [<samp>(12d8c)</samp>](https://github.com/wobsoriano/trpc-nuxt/commit/12d8c97f71bedb025b2e7914db13e69e5f62c8a2)
  - Bump ofetch to 1.1.1 &nbsp;-&nbsp; by @wobsoriano [<samp>(811a6)</samp>](https://github.com/wobsoriano/trpc-nuxt/commit/811a6340107a2bea53f2cf488416bcec915f88b0)

## v0.10.5

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.4...v0.10.5)

### 🚀 Enhancements

- Pass input to watched sources if it's a ref ([892d167](https://github.com/wobsoriano/trpc-nuxt/commit/892d167))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.4

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.3...v0.10.4)

### 🚀 Enhancements

- Add reactive inputs ([054fad9](https://github.com/wobsoriano/trpc-nuxt/commit/054fad9))

### 📖 Documentation

- Update local deps ([7683499](https://github.com/wobsoriano/trpc-nuxt/commit/7683499))

### 🏡 Chore

- Remove engines property ([e15a62a](https://github.com/wobsoriano/trpc-nuxt/commit/e15a62a))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v0.10.3

[compare changes](https://github.com/wobsoriano/trpc-nuxt/compare/v0.10.2...v0.10.3)

### 🚀 Enhancements

- Export createH3ApiHandler for h3 apps ([18cd492](https://github.com/wobsoriano/trpc-nuxt/commit/18cd492))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))
