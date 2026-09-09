import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import { dataRoute } from './routes/data'
import { graphRoute } from './routes/graph'

const app = new OpenAPIHono()

app.get('/', (c) => c.text('GitHub Readme Activity Graph 📈'))
app.route('/', graphRoute)
app.route('/', dataRoute)

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: { title: 'GitHub Readme Activity Graph', version: '1.0.0' },
})
app.get('/docs', Scalar({ url: '/openapi.json' }))

export default app
