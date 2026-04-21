import express from 'express';
import cors from 'cors';


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



///export health route 
import healthRoute  from "./routes/healthcheck.routes.js"

app.use("/api/v1/health",healthRoute)


export default app;