const WSM=require("../Models/workoutSessionModel")
const workoutModel=require("../Models/workoutModel")
const userModel = require("../Models/userModel")
const {isValidObjectId}=require('mongoose')
const moment=require("moment")

const calorieCount=async(req,res)=>{
   try  {
    let data=req.body
     let userId=req.decodeToken
    let {workout,timeDuration}=data
   
    if(!userId) return res.status(400).send({status:false, message:"login first"})
    data.userId=userId
    //if(req.decodeToken!=userId) return res.status(403).send({status:false,msg:"you are not aunthenticated"})
    if(!workout) return res.status(400).send({status:false, message:"please provide type of exercise"})
    if(!timeDuration) return res.status(400).send({status:false, message:"please provide time duration"})
  
     timeDuration=parseInt(timeDuration)
    if(typeof(timeDuration)!="number") return res.status(400).send({status:false, message:"please provide time duration in number"})
 
    let calories=await workoutModel.findOne({workout:workout})
    
    let total=timeDuration*(calories.calorieperMinute)
    total = total.toFixed(2);
    
    const user = await userModel.findByIdAndUpdate(userId,{$inc:{caloriesBurnTillNow:total}});
    user.workouts.push({ workoutId: calories._id, time:timeDuration });
    await user.save()
   
    data.totalCaloriesBurn=total
    data.date=moment()
    let createCalo=await WSM.create(data)
    return res.status(201).send({status:true, data:createCalo})
  }catch(err){
    return res.status(500).send({status:false, message:err.message})
  }
}


const TargtCalrs= async(req,res)=>{
   try {
      let userId=req.decodeToken
    let data=req.body
    let {timeDuration,targetCalories}=data
    if(!timeDuration) return res.status(400).send({status:false, message:" Please provide timeDuration"})
    if(!targetCalories) return res.status(400).send({status:false, message:"Please provide TargetCalories"})
    let target=(targetCalories/timeDuration)
    console.log(target)
    let workout=await workoutModel.find({calorieperMinute:{$gte:target}}).sort({calorieperMinute:1})
    return res.status(200).send({status:false, data:workout[0]})
}catch(err){
  return res.status(500).send({status:false, message:err.message})
}
}

const getAllSessions= async (req,res)=>{
   try{
        let userId=req.decodeToken
        if(!userId) return res.status(400).send({status:false,message:"login first"})
    if(!isValidObjectId(userId)) return res.send("Invalid mongoose objectId")
       
        let data=await WSM.find({userId:userId})
        if(!data) return res.status(400).send({status:true,message:"no sessions found"})
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
        return res.status(200).send({status:true,data:data})
   }catch(err){
    return res.status(500).send(err.message)
   }
}

const deleteSession=async (req,res)=>{
    let userId=req.decodeToken
    
    let workoutSsnId=req.params.wrktSSnId
    if(!userId) return res.status(400).send({status:false, message:"please provide userId"})
    if(!workoutSsnId) return res.status(400).send({status:false,message:"workout sessionId is required"})
    if(!isValidObjectId(workoutSsnId)) return res.status(400).send({status:false, message:"Invalid workout sessionId"})
    let data=await WSM.findById({_id:workoutSsnId,isDeleted:false})
    if(!data) return res.status(404).send({status:false, message:"No session found"})
    await WSM.findByIdAndUpdate({_id:workoutSsnId},{isDeleted:true})
    return res.status(200).send({status:false, message:"Session deleted Successfully"})
}




module.exports={calorieCount,deleteSession,TargtCalrs,getAllSessions}
