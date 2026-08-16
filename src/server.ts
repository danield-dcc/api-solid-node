import { app } from './app.ts'
import { env } from './env/index.ts'

const port = env.PORT

app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`🚀 HTTP Server Running on ${port}`)
})
