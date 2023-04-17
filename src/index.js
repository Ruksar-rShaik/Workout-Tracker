const express=require("express")
const mongoose=require("mongoose")
const app= express()
const router=require("./Routes/route")
const cors=require("cors")
 require('dotenv').config()

app.use(cors())
app.use(express.json())
mongoose.connect(process.env.dbUrl)
.then(()=>console.log("mongoose is connected"))
.catch((err)=>console.log(err))

app.use('/',router)

app.listen(3001,function(){
    console.log("Express app running on port" + (3001))
})