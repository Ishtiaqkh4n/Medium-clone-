import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();

    //basic setup for express server
    app.use(cors())
    //to parse json to object
app.use(express.json())

//to parse urlencoded data convert it into javascript object and then we can user in req.body
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res
    .status(200)
    .send("Home route of the backend")
})

app.get("/helloworld",(req,res)=>{
    res
    .status(200)
    .send("Hello World! Wellcome here ")
})


// // import auth routes

import authRoutes from "./routes/auth.routes.js"
app.use("/api/v1/auth",authRoutes)


// import Blog routes
import blogroutes from "./routes/Blog.routes.js"
app.use("/api/v1/blog",blogroutes)


export default app;