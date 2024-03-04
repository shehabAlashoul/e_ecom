import express from 'express'
import application from './app/app.js'
const app = express()
const port = 3000
application(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))