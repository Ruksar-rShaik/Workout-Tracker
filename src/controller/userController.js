const userModel=require("../Models/userModel")
const jwt=require("jsonwebtoken")
const {isValidAlpha, validMail, validNumber, isValidPassword, trimData } = require("../validations/validation");
const bcrypt=require("bcrypt")

const createUser= async(req,res)=>{
    let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:true, message:"please provide name,gender,email,phone and password"})
    let{name, gender,email,password,phone}=data

        if (!name) return res.status(400).send({ status: false, message: 'name is required, please enter name to register a user' });
        // if (!isValidAlpha(name)) return res.status(400).send({ status: false, message: 'name is invalid, please enter a valid name to register a user' });
        if(!gender) return res.status(400).send({status:false, message:"please provide password"})
        
        if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to register a user' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'email is invalid, please enter a valid email' });
        if (!phone) return res.status(400).send({ status: false, message: 'phone number is required, please enter phone number to register a user' });
        if (!validNumber(phone)) return res.status(400).send({ status: false, message: 'phone number is invalid, please enter a valid phone number to register a user' });

        if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to register a user' });
        if (isValidPassword(password)) return res.status(400).send({ status: false, message: 'password is weak, please enter a strong password to register a user' });

        let user = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (user) {
           if (user.email == email)
                return res.status(409).send({ status: false, message: 'email already in use, please enter a unique email to register a user' });
            if (user.phone == phone)
                return res.status(409).send({ status: false, message: 'phone number is already in use, please enter a unique phone number to register a user' });
        }
        const saltRounds=password.length
        let hash=await bcrypt.hash(password,saltRounds)
        data.password=hash
        const userCreated = await userModel.create(data);
        res.status(201).send({ status: true, message: 'User created successfully', data: userCreated });
        
    } 

    const userLogin = async function (req, res) {
        try {
            const body = req.body;
            const { email, password } = body;
            if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to login a user' });
            if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to login a user' });
            const user = await userModel.findOne({ email: email });
            if (!user) return res.status(400).send({ status: false, message: 'email is incorrect' });
          let passwordDec= bcrypt.compare(password, user.password)
          if(!passwordDec) return res.status(400).send({status:false, message:"password is incorrect"})
                   
        let token=jwt.sign({userId:user._id},"workout string")
        return res.status(200).send({ status: true, message: 'Login successfully', userId:user._id, token:token });
        
    }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    };
    

    module.exports={createUser,userLogin}