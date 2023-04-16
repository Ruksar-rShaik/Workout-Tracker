const mongoose=require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

const workoutSessionSchema=new mongoose.Schema({
    userId:{
        type:ObjectId,
        ref:"user",
        required:true
    },
    workout:{
        type:String,
        required:true
    },
    timeDuration:{
        type:String,
        required:true
    },
    totalCaloriesBurn:{
        type:"Number",
        required:true
    },
    date:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timeStamps:true})

module.exports=mongoose.model("workoutSession",workoutSessionSchema)