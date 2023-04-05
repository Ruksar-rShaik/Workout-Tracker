const express=require("express")
const mongoose=require("mongoose")
const app= express()
const router=require("./Routes/route")
app.use(express.json())
mongoose.connect("mongodb+srv://Ruksar:1ststep@ruksar.cg402ym.mongodb.net/workout")
.then(()=>console.log("mongoose is connected"))
.catch((err)=>console.log(err))

app.use('/',router)

app.listen(3000,function(){
    console.log("Express app running on port" +(3000))
})