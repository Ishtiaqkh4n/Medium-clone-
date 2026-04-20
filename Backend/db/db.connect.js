import mongoose from "mongoose"

const connectDb = async()=>{
    await mongoose.connect(process.env.MONGOURI)
}


export default connectDb