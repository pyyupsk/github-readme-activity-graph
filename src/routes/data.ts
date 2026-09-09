import { Hono } from 'hono'

import { describeError, fetchContributions } from '../github/client'
import { withCache } from '../lib/cache'
import { parseParams, resolveRange } from '../lib/params'

type Bindings = { GH_TOKEN: string }

export const dataRoute = new Hono<{ Bindings: Bindings }>()

dataRoute.get('/data', (c) =>
  withCache(c.req.raw, c.executionCtx, async () => {
    const params = parseParams(c.req.query())
    if (!params.username) return c.json({ error: 'Missing "user" parameter' }, 400)

    const { from, to } = resolveRange(params)

    try {
      const data = await fetchContributions(params.username, c.env.GH_TOKEN, from, to)
      return c.json(data, 200, { 'Cache-Control': 'public, max-age=1800' })
    } catch (err) {
      return c.json({ error: describeError(err) }, 502, { 'Cache-Control': 'no-store' })
    }
  }),
)
