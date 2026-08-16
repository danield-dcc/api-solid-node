import { app } from './app.js'

const port = 3333

app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`HTTP Server Running on ${port}`)
})
