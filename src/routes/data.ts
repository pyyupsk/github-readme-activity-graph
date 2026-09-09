import { Hono } from 'hono'
import { describeError, fetchContributions } from '../github/client'
import { parseParams, resolveRange } from '../lib/params'

type Bindings = { GH_TOKEN: string }

export const dataRoute = new Hono<{ Bindings: Bindings }>()

dataRoute.get('/data', async (c) => {
  const params = parseParams(c.req.query())
  if (!params.username) return c.json({ error: 'Missing "user" parameter' }, 400)

  const { from, to } = resolveRange(params)

  try {
    const data = await fetchContributions(params.username, c.env.GH_TOKEN, from, to)
    return c.json(data)
  } catch (err) {
    return c.json({ error: describeError(err) }, 502)
  }
})
