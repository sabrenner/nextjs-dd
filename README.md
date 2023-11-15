# Next.js + Datadog Request Timeout Reproduction

## Background
Attempt at reproducing an issue with a request timing out using a custom server (trying both normal HTTP server and express for actual timeout middleware), Next.js 12 (12.3.1), and dd-trace@latest. The error in question is:

```
TypeError: Cannot read properties of undefined (reading 'url') 
  at NextPlugin.pageLoad (webpack://hello/./node_modules/dd-trace/packages/datadog-plugin-next/src/index.js?:89:27) 
  at eval (webpack://hello/./node_modules/dd-trace/packages/datadog-plugin-next/src/index.js?:17:55) 
  at Subscription._handler (webpack://hello/./node_modules/dd-trace/packages/dd-trace/src/plugins/plugin.js?:14:9) 
  at Channel.publish (node:diagnostics_channel:54:9) 
  at NextNodeServer.findPageComponents (webpack://hello/./node_modules/dd-trace/packages/datadog-instrumentations/src/next.js?:86:23) 
  at NextNodeServer.renderPageComponent (/Users/jack/hello/node_modules/next/dist/server/base-server.js:1579:35) 
  at NextNodeServer.renderPageComponent (/Users/jack/hello/node_modules/next/dist/server/next-server.js:410:22)
```

In the past, this error was caused by using Next.js middleware. In newer version (Next.js 13.5+), an error was thrown internally in Next.js to transition from middleware to the actual endpoint logic. On the Datadog side, we didn't trace high up enough in the stack to see that this error was caught, so we caught it additionally ourselves and ended the span early. Since Next.js uses the same handler function for both middleware and normal endpoint logic (like an API route, or handling a page load), and we safeguard double-tracing the same request, we wouldn't start a span for the next invocation of the handler method. This means that when the page load function was called, which we also wrap in order to attach the page resource name to the span, we would fail since there was neither a span nor, as a consequence, a request.

This has been more difficult to reproduce here because the `next` span always starts before the request times out (assuming the timeout threshold is set to some amount that the request would timeout during some handler within Next.js). Thus, the requst always gets associated with the span (via a WeakMap within the tracer code). Since the GC might not collect the span for a little bit, even after the span is finished, when the page load function is called in Next.js, and as a consequence our wrapper function in the tracer, the span still exists with reference to the request in our logic, making it so that we can still attach a page resource to the span. 

This is where I'm having trouble seeing the way to set up this scenario properly, and my confusion as to why it's happening in the first place.

## To run

```
npm install
npm run build
node --require dd-trace/init server
```

## Provided
Besides the root `/`, a page `/hello` which calls `/api/hello` during `getServerSideProps`. `/api/hello` has a timeout on resolving its promise for the request, in an attempt to simulate a longer call time for ease in timing out the request somewhere else.