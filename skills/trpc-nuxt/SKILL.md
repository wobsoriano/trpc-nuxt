---
name: trpc-nuxt
description: Use when integrating tRPC with Nuxt.js to build end-to-end typesafe applications
---

# Trpc-Nuxt Skill

## Overview
Provides comprehensive guidance for integrating tRPC with Nuxt.js to create typesafe APIs.

## When to Use
- Setting up a new tRPC backend in a Nuxt project
- Creating tRPC procedures and routers
- Configuring the tRPC client for use in Nuxt components and plugins
- Implementing server-side calls, response caching, mutations, and authorization
- Debugging tRPC-Nuxt integration issues

## Quick Reference

Common patterns for tRPC-Nuxt:

- Setting up the tRPC backend: Initialize tRPC with `initTRPC`, create routers and procedures.
- Creating the HTTP handler: Use `createTRPCNuxtHandler` to create an API endpoint.
- Creating the client plugin: Use `createTRPCNuxtClient` in a Nuxt plugin to set up the tRPC client.
- Using $trpc in Nuxt pages: Access the tRPC client via `$trpc` and use `useQuery` and `useMutation` composables.
- Using links directly: Use `httpLink` and `pickHeaders` from `trpc-nuxt/client` for custom client setup.
- Calling procedures from the server: Use `appRouter.createCaller({})` to call procedures directly from the server.
- Setting up response caching: Configure `responseMeta` in `createTRPCNuxtHandler` or use Nitro's `defineCachedEventHandler`.
- Optimistic updates: Use `useNuxtData` and `refreshNuxtData` to update UI optimistically after mutations.
- Authorization: Implement authorization via resolver (checking `ctx.user`) or middleware (creating protected procedures).

## Implementation
The skill is organized into reference files in the `references/` directory:
  - setup.md: Recommended file structure and setup steps
  - links.md: Using trpc-nuxt/client links
  - createTRPCNuxtHandler.md: Creating the HTTP handler
  - createTRPCNuxtClient.md: Creating the client plugin
  - server-side-calls.md: Calling procedures from the server
  - response-caching.md: Setting up response caching
  - mutation-and-revalidation.md: Optimistic updates and mutations
  - authorization.md: Implementing authorization

## Common Mistakes
- Forgetting to export the appRouter from the router file
- Not setting up the tRPC client plugin correctly, leading to undefined $trpc
- Missing responseMeta configuration for caching, causing unnecessary re-fetches
- Attempting to call procedures from the server without creating a caller
- Incorrectly implementing authorization by not checking the context properly