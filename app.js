require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const cookieParser = require('cookie-parser')

const swaggerSpec = require('./configurations/swaggerConfig') 
const userRoute = require('./routes/userRoute')
const { CSS_URL } = require('./configurations/constants')
const rateLimiter = require('./middleware/rateLimiterMiddleware')

app.use(cors({
    origin: process.env.CORS_ORIGIN_URL, 
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (request, response) => {
    response.status(200).send({ message: "Server running successfully."})
})

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {customCssUrl: CSS_URL}))
app.use('/api/v1/user', rateLimiter.standard, userRoute)

module.exports = app