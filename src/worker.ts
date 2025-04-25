import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

interface Env {
  __STATIC_CONTENT: KVNamespace
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url)
      
      // Handle static assets
      if (url.pathname.startsWith('/_next/static/')) {
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: {},
          }
        )
      }

      // Handle all other routes by serving the main page
      // Next.js will handle client-side routing
      const newRequest = new Request(new URL('/', request.url), request)
      return await getAssetFromKV(
        {
          request: newRequest,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: {},
          mapRequestToAsset: serveSinglePageApp,
        }
      )
    } catch (e) {
      let pathname = new URL(request.url).pathname
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      })
    }
  },
} 