import app from "./app.js"
import connectDb from "./db/db.connect.js"


const PORT  = process.env.PORT || 8000

// connecting to the mongoose then starting the backend
connectDb()
.then(()=>{

    app.listen(process.env.PORT,() => { 
        console.log(`Backend successfully started and running on http://localhost:${PORT}`)
     })
}).catch((error) => {console.log('Unable to start backend error:  ',error.message)  })




