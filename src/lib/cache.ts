export async function withCache(
  request: Request,
  ctx: { waitUntil(promise: Promise<unknown>): void },
  build: () => Promise<Response>,
): Promise<Response> {
  const cache = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await build()
  if (response.headers.get('Cache-Control')?.includes('no-store')) return response

  ctx.waitUntil(cache.put(request, response.clone()))
  return response
}
