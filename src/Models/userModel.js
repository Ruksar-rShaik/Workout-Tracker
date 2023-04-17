const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        enum:["Male","Female","others"],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    }, 
    workouts:[{
        workoutId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workout",

    },
    time:{
        type:Number,
        
    },
    _id:false
}],

    caloriesBurnTillNow:{
        type:Number
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model("user",userSchema)