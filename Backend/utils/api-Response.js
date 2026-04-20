class ApiResponse{
    constructor(statusCode,message,data){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = this.statusCode >=200
    }
}


export {
    ApiResponse
}