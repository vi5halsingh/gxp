import app from "./app.js"
import http from "http"
import connectDB from "./config/db.js"

const server = http.createServer(app)

server.listen(process.env.PORT,() =>{
    console.log(`server is running on port ${process.env.PORT}`)
    connectDB()
})