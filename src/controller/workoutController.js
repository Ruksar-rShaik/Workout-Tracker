const workoutModel = require("../Models/workoutModel")



const workout=async(req,res)=>{
   try{ 
    let data=req.body
    let createWorkout=await workoutModel.create(data)
    return res.status(201).send(createWorkout)
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}
    
}
    


    // const gettempWorkout=async(req,res)=>{
    //     try{
    //     let data=req.body
    //     let {workout,timeDuration}=data
        
    //     if(!timeDuration) return res.status(400).send({status:false, message:"please provide time duration in minutes"})
    //     if(!workout) return res.status(400).send({status:false, message:"please provide type of exercise"})
    //     if(typeof(timeDuration)!="Number") return res.status(400).send({status:false, message:"please provide time duration in number"})
    //     console.log(timeDuration)
        
    //     let gettempWorkout= await workoutModel.findOne({workout:workout})
       
    //     if(!gettempWorkout) return res.status(404).send({status:false,message:"No workouts found"})
    //     let tempCalBurn=gettempWorkout.calorieperMinute*timeDuration
        
    //     res.status(200).send({status:true, data:tempCalBurn})
    //     }catch(err){
    //         return res.status(500).send({status:false,message:err.message})
    //     }
    // }

    module.exports={workout}