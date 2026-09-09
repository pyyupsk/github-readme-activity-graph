import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import { dataRoute } from './routes/data'
import { graphRoute } from './routes/graph'

const app = new OpenAPIHono()

const favicon = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="#ffcfe9"/>
  <path d="M5 22 L11 14 L16 18 L27 6" fill="none" stroke="#9e4c98" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="27" cy="6" r="2.5" fill="#403d3d"/>
</svg>`

app.get('/favicon.svg', (c) => c.body(favicon, 200, { 'Content-Type': 'image/svg+xml' }))
app.get('/', (c) => c.text('GitHub Readme Activity Graph 📈'))
app.route('/', graphRoute)
app.route('/', dataRoute)

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: { title: 'GitHub Readme Activity Graph', version: '1.0.0' },
})
app.get('/docs', Scalar({ url: '/openapi.json', favicon: '/favicon.svg' }))

export default app
