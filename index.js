import express from 'express'
import application from './app/app.js'
const app = express()
const port = +process.env.PORT
application(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))