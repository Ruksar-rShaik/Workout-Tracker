const express=require("express")
const router=express.Router()
const {createUser,userLogin,updateUser,deleteUser,getUserDetails}=require("../controller/userController")
const{workout}=require("../controller/workoutController")
const{calorieCount,deleteSession,TargtCalrs,getAllSessions}=require("../controller/workoutSessionController")
const {monthlyLeaderBoard,weeklyLeaderBoard}=require("../controller/leaderBoard")
const{tokenVerify}=require("../auth")

router.post("/signup", createUser)
router.post("/login", userLogin)
router.get("/leaderBoard",getUserDetails)
router.put("/updateUser",tokenVerify,updateUser)
router.delete("/deleteteUser",tokenVerify,deleteUser)


router.post("/workout",workout)
//router.post("/getWorkout",gettempWorkout)

router.post("/session",tokenVerify,calorieCount)
router.post("/SugstWorkout",tokenVerify,TargtCalrs)
router.delete("/deleteSsn/:wrktSSnId",tokenVerify,deleteSession)
router.get("/getSingleUser",tokenVerify,getAllSessions)

router.get('/monthlyLeaderBoard',monthlyLeaderBoard)
router.get('/weeklyLeaderBoard',weeklyLeaderBoard)


router.get("/test")



router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"url not found"})})


module.exports=router