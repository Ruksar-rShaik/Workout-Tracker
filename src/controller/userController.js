const userModel=require("../Models/userModel")
const jwt=require("jsonwebtoken")
const {isValidAlpha, validMail, validNumber, isValidPassword, trimData } = require("../validations/validation");
const bcrypt=require("bcrypt");
const workoutSessionModel = require("../Models/workoutSessionModel");

const createUser= async(req,res)=>{
    let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:true, message:"please provide name,gender,email,phone and password"})
    let{name, gender,email,password,phone}=data

        if (!name) return res.status(400).send({ status: false, message: 'name is required, please enter name to register ' });
        if (!isValidAlpha(name)) return res.status(400).send({ status: false, message: 'name is invalid, please enter a valid name to register ' });
        if(!gender) return res.status(400).send({status:false, message:"please provide gender"})
        let arr=["Male","Female","others"]
        if(!arr.includes(gender)) return res.status(400).send({status:false,message:"enter valid gender"})
        
        if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to register' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'email is invalid, please enter a valid email' });
        if (!phone) return res.status(400).send({ status: false, message: 'phone number is required, please enter phone number to register' });
        if (!validNumber(phone)) return res.status(400).send({ status: false, message: 'phone number is invalid, please enter a valid phone number to register' });

        if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to register' });
        if (isValidPassword(password)) return res.status(400).send({ status: false, message: 'password is weak, please enter a strong password to register' });

        let user = await userModel.findOne({ $or: [{ email: email }, { phone: phone },{name:name}] });
        if (user) {
            if(user.name==name) return res.status(409).send({status:false, message:"name already in use, please enter a unique name to register"}) 
           if (user.email == email)
                return res.status(409).send({ status: false, message: 'email already in use, please enter a unique email to register' });
            if (user.phone == phone)
                return res.status(409).send({ status: false, message: 'phone number is already in use, please enter a unique phone number to register' });
            if (user.name == name)
                return res.status(409).send({ status: false, message: `${name}is already in use, please enter a unique name`  });   
        }
        const saltRounds=10
        let hash=await bcrypt.hash(password,saltRounds)
        data.password=hash
        const userCreated = await userModel.create(data);
        res.status(201).send({ status: true, message: 'User created successfully', data: userCreated });
        
    } 

    const userLogin = async (req, res)=> {
        try {
            const data = req.body;
            const { email, password } =data;
            if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to login' });
            if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to login' });
            const user = await userModel.findOne({ email: email });
        
            if(user){
            if(user.isDeleted==true) return res.status(404).send({status:false,message:"user not found"})
            }
            if (!user) return res.status(400).send({ status: false, message: 'email is incorrect' });
            bcrypt.compare(password, user.password,(err,result)=>{
            if(result){
             let token=jwt.sign({userId:user._id},"workout string")
             return res.status(200).send({ status: true, message: 'Login successfully',token:token });
            }
            else return res.status(400).send({status:false, message:"password is incorrect"})
           })
         
    }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    };

    const getUserDetails= async (req,res)=>{
        let data=await userModel.find({isDeleted:false}).select({name:1,caloriesBurnTillNow:1,_id:0}).sort({caloriesBurnTillNow:-1})
        
        return res.status(200).send({status:true ,data:data})
    }


    const updateUser=async (req,res)=>{
        try{
            const data=req.body
            let userId=req.decodeToken
            //if(userId!=req.params.userId) return res.status(400).send({msg:""})
            let chkUnique= await userModel.findOne({_id:userId})
            if(!chkUnique) return res.status(400).send({msg:"user doesn't exist"})
            if(chkUnique){
                if(chkUnique.isDeleted==true) return res.status(400).send({status:false,message:"user already deleted"})
                if(chkUnique.email==data.email) return res.status(301).send({status:false, message:"email is already present"})
                if(chkUnique.phone==data.phone) return res.status(301).send({status:false, message:"phone number is already present"})
            }
            let user=await userModel.findOneAndUpdate({_id:userId},data,{new:true})
            return res.status(200).send({data:user})

        }catch(error){
            return res.status(500).send({status:false,message:error.message})
        }
    }
    
    const deleteUser=async (req,res)=>{
        try{
            const data=req.body
            let userId=req.decodeToken
            //if(userId!=req.decodeToken) return res.status(403).send({msg:"you are unauthorised"})
            let chkUser= await userModel.findOne({_id:userId})
            
            if(chkUser.isDeleted==true) return res.status(400).send({msg:"user already deleted"})
            let delUser=await userModel.findOneAndUpdate({_id:userId},{isDeleted:true},{new:true})
            await workoutSessionModel.findOneAndUpdate({userId:userId},{isDeleted:true})
            return res.status(200).send({msg:"Deleted Successfully",data:delUser})

        }catch(err){
            return res.status(500).send({message:err.message})
        }
    }

    module.exports={createUser,userLogin,getUserDetails,updateUser,deleteUser}