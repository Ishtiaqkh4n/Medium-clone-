import { body } from "express-validator";



const userRegisterValidator = function(){
    return [
     body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("provide the email format"),
     body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({min:3})
      .withMessage("username must be atleast 3 character long"),
     body("password") 
       .trim()
       .notEmpty()
       .withMessage("password is required")    
       .isLength({min:8})
       .withMessage("password must be 8 character long")  
    
    ]
}

const userloginValidator = function(){
    return [
     body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("provide proper format"),
     body("password") 
       .notEmpty()
       .withMessage("password is required")
    ]
}



export {
    userRegisterValidator,
    userloginValidator
}