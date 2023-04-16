const mongoose=require("mongoose")

const workoutSchema= new mongoose.Schema({
    
    workout:{
        type:String,
        // enum:["Walking","Zumba","Running","Gym","Aerobics","Yoga","Dance","swimming","WeightLifting"],
        required:true
    },
    calorieperMinute:{
        type:Number,
        required:true
    },
   
},{timeStamps:true})

module.exports=mongoose.model("workout",workoutSchema)