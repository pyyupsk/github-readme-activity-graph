import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'

import { describeError, fetchContributions } from '../github/client'
import { withCache } from '../lib/cache'
import { graphQuerySchema } from '../lib/openapi'
import { parseParams, resolveRange } from '../lib/params'

type Bindings = { GH_TOKEN: string }

export const dataRoute = new OpenAPIHono<{ Bindings: Bindings }>()

const contributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number(),
})

const route = createRoute({
  method: 'get',
  path: '/data',
  request: { query: graphQuerySchema },
  responses: {
    200: {
      description: 'Contribution data as JSON',
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().nullable(),
            contributions: z.array(contributionDaySchema),
          }),
        },
      },
    },
    400: {
      description: 'Missing "user" parameter',
      content: { 'application/json': { schema: z.object({ error: z.string() }) } },
    },
    502: {
      description: 'GitHub API error',
      content: { 'application/json': { schema: z.object({ error: z.string() }) } },
    },
  },
})

dataRoute.openapi(route, (c) =>
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
