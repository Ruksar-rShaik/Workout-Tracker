const mongoose=require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

const exerciseSchema= mongoose.Schema({
    userId:{
        type:ObjectId,
        ref:"user"
    },
    workout:{
        type:String,
        required:true
    },
    timeDuration:{
        type:String,
        required:true
    },
    caloriesBurnt:{
        type:String,
        default:0
    }
},{timeStamps:true})

module.exports=mongoose.model("exercise",exerciseSchema)