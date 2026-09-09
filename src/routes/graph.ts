import { Hono } from 'hono'
import { describeError, fetchContributions } from '../github/client'
import { withCache } from '../lib/cache'
import { parseParams, resolveRange } from '../lib/params'
import type { Colors } from '../render/theme'
import { selectTheme } from '../render/theme'
import { errorSvg, graphSvg } from '../render/svg'

type Bindings = { GH_TOKEN: string }

export const graphRoute = new Hono<{ Bindings: Bindings }>()

graphRoute.get('/graph', (c) =>
  withCache(c.req.raw, c.executionCtx, async () => {
    const params = parseParams(c.req.query())

    if (!params.username) {
      return svgResponse(errorSvg('Missing "user" parameter'), 'no-store, max-age=0')
    }

    const { from, to } = resolveRange(params)

    try {
      const data = await fetchContributions(params.username, c.env.GH_TOKEN, from, to)

      const theme = selectTheme(params.theme)
      const overrides = Object.fromEntries(Object.entries(params.colors).filter(([, v]) => v))
      const colors: Colors = { ...theme, ...overrides }

      const title = params.hideTitle
        ? null
        : (params.title ?? `${data.name ?? params.username}'s Contribution Graph`)

      const svg = graphSvg({
        width: 1200,
        height: params.height,
        radius: params.radius,
        colors,
        title,
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
