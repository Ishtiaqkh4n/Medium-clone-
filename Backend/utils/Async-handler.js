

//instead of too many try catch block we can use 
// this async handler to handler all errors in one place and
//  we can use this async handler in all our routes and controllers to handle errors
const asyncHandler = (fnin)=>{
  return (req,res,next)=>{
    Promise.resolve(fnin(req,res,next))
    .catch((err)=>next(err))
  }
}


export default asyncHandler;