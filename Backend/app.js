import express from 'express';
import cors from 'cors';


const app = express();

//basic setup for express server
app.use(cors())
//to parse json to object
app.use(express.json())



app.get("/",(req,res)=>{
    res
    .status(200)
    .send("Home route of the backend")
})



///export health route 
import healthRoute  from "./routes/healthcheck.routes.js"

app.use("/api/v1/health",healthRoute)


export default app;