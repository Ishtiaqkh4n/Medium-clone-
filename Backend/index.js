const app = require("./app")
const mongoose = require('mongoose')


// connecting to the mongoose then starting the backend

mongoose.connect(process.env.DBURI).then(() => { 

    app.listen(process.env.PORT,() => { 
        console.log(`Backend successfully started and running on ${process.env.PORT}`)
     })
 }).catch((err) => { 
    console.error(`Backend faild to start: ${err.message}`)
  })