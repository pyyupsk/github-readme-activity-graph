import { Hono } from 'hono'

import { describeError, fetchContributions } from '../github/client'
import { withCache } from '../lib/cache'
import type { GraphParams } from '../lib/params'
import { parseParams, resolveRange } from '../lib/params'
import { errorSvg, graphSvg } from '../render/svg'
import { resolveColors } from '../render/theme'

type Bindings = { GH_TOKEN: string }

export const graphRoute = new Hono<{ Bindings: Bindings }>()

function resolveTitle(params: GraphParams, name: string | null | undefined): string | null {
  if (params.hideTitle) return null
  return params.title ?? `${name ?? params.username}'s Contribution Graph`
}

graphRoute.get('/graph', (c) =>
  withCache(c.req.raw, c.executionCtx, async () => {
    const params = parseParams(c.req.query())

    if (!params.username) {
      return svgResponse(errorSvg('Missing "user" parameter'), 'no-store, max-age=0')
    }

    const { from, to } = resolveRange(params)

    try {
      const data = await fetchContributions(params.username, c.env.GH_TOKEN, from, to)

      const svg = graphSvg({
        width: 1200,
        height: params.height,
        radius: params.radius,
        colors: resolveColors(params.theme, params.colors),
        title: resolveTitle(params, data.name),
        area: params.area,
        grid: params.grid,
        contributions: data.contributions,
      })

      return svgResponse(svg, 'public, max-age=1800')
    } catch (err) {
      return svgResponse(errorSvg(describeError(err)), 'no-store, max-age=0')
    }
  }),
)

function svgResponse(svg: string, cacheControl: string): Response {
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': cacheControl },
  })
}
