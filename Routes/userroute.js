const express=require("express");
const {User}=require("../models/usermodel");
const bcrypt = require('bcrypt');

const userroute=express.Router();

userroute.post("/register",async(req,res)=>{

    const {email,password}=req.body;
    
    
   try{
        
   let exist=await User.findOne({email:email});

   if(exist){
    res.send({msg:"user already registered please login"});

   }

   else{

    bcrypt.hash(password, 5, async function(err, hash) {
        
        if(err){
            res.send(err);
        }

        else{

            const user=new User({email,password:hash,wrongattempt:0,blocktill:null});

            await user.save();
            res.send({msg:"user registered successfully"});
        }
    });

   }

   }
   catch(err){
    console.log(err);
   }
})


userroute.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    try{

        const user=await User.find({email});

        if(user.length>0){

               if(!user[0].blocktill || user[0].blocktill < new Date()){

                bcrypt.compare(password, user[0].password, async function(err, result) {
                if(result){
                    
                    await User.findByIdAndUpdate(user[0]._id,{wrongattempt:0,blocktill:null})

                    res.send({msg:"Login successful",email:user[0].email})
                }
                else{

                    await User.findByIdAndUpdate(user[0]._id,{wrongattempt:user[0].wrongattempt+1})

                    if(user[0].wrongattempt>=5){
                        const block= 24*60*60*1000;

                        const blocktime=new Date().getTime() + block;

                        await User.findByIdAndUpdate(user[0]._id,{blocktill:new Date(blocktime)});

                        
                    }
                    res.send({msg:"Wrong credentials"});
                }
            });
        }

        else{
            let time=user[0].blocktill;
            time=new Date(time);

            res.send({msg:`blocked till ${time.toLocaleString()} `})
        }



        }
        else{
            res.send({msg:"please login first"});
        }
    }
    catch(err){
        res.send(err);
    }
})



module.exports={userroute};