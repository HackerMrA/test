const User=require('../models/user');


exports.userById=(req,res,next,id)=>{
    User.findById(id)
    .exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User not found!"
            })
        }

        req.profile=user; //add profile object in req with user info
        next();
    })
}



exports.allUser=(req,res)=>{
    User.find((err,users)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(users);
    }).select("name email created")
}








