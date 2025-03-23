export default eventHandler((event) => {
  event.context.auth = {
    userId: 'abc_123'
  }
})

declare module 'h3' {
  interface H3EventContext {
    auth: { userId: string };
  }
}
