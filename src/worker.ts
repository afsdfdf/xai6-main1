import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

interface Env {
  __STATIC_CONTENT: KVNamespace
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await getAssetFromKV(
        {
          request,
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