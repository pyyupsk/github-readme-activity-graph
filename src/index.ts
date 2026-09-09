import { Hono } from 'hono'
import { dataRoute } from './routes/data'
import { graphRoute } from './routes/graph'

const app = new Hono()

app.get('/', (c) => c.text('GitHub Readme Activity Graph 📈'))
app.route('/', graphRoute)
app.route('/', dataRoute)

export default app
