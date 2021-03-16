const User=require('../models/user');
const jwt=require('jsonwebtoken');
var expressJwt = require('express-jwt');
// load env
const dotenv = require("dotenv");
dotenv.config();

exports.signup=async(req,res)=>{
    console.log("signup")
    const userExists=await User.findOne({email:req.body.email});
    if(userExists) return res.status(403).json({
        error:"Email is taken"
    })

    const user=await  new User(req.body);
    await user.save();

    res.json({message:"Signup successful"});
}


exports.signin=(req,res)=>{
    //find the user based on email
    const {email,password}=req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(401).json({
                error:"User with that email does not exist"
            })
        }

        //if user is found make sure email and password matches
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and Password do not match"
            })
        }

        //generate token
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t",token,{expire:new Date()+99999});

        //return response with user and token to frontend client
        const {_id,name,email}=user;
        return res.json({
            token,
            user:{
                _id,email,name
            }
        })

    })
    
}


exports.signout=(req,res)=>{
    res.clearCookie("t");
    return res.json({message:"Successfully logged out!"})
}


exports.requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});
