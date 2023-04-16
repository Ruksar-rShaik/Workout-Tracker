const jwt=require("jsonwebtoken")
const userModel=require("./Models/userModel")


const tokenVerify=function(req,res,next){
    try{
        let token=req.headers["x-api-key"]
        
        if(!token) return res.status(400).send({status:false,msg:"Token is required"})
        
        jwt.verify(token,"workout string",function(err,decodedToken){
        if(err) return res.status(401).send({msg:"Invalid Token"})
        if (decodedToken) {
            req.decodeToken = decodedToken.userId
            next()
        } else {
            return res.status(401).send({ status: false, message: "Token is invalid" })
        }
    })
    }catch(e){
        res.status(500).send(e.message)
    }
}
module.exports={tokenVerify}