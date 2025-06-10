const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use("/api",router)

const PORT = process.env.PORT || 8080


connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log("connnect to DB")
        console.log("Server is running " + PORT)
    })

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Please use a different port.`)
            process.exit(1)
        } else {
            console.error(error)
        }
    })
})
