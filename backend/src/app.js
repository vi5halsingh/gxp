import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/",(req, res) =>{
    res.send("hello from server")
})

app.use((err, req, res,_) =>{
    console.log("universal error occures",err)
    res.status(statusCode).json({
        success :false,
        status : statusCode,
        message : message,
        stack : process.env.NODE_ENV === "development" ? err.stack : undefined
    })
})

import userRouter from "./routes/user.routes.js"
app.use('/api/user',userRouter)

export default app;