var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');//new
userschema=require('../models/chitadmin')
chitschema=require('../models/newchit')
memberschema=require('../models/member')
const Authentication = require("../auth");
const authentication = new Authentication();


exports.loggin=async function (req, res) {
    const { username, password } = req.body;
    const users = await userschema.findOne({username:username,password:password});
    if (users){
        let payloadToCreateToken = {
            username:username,
            password:password
          };
        let accessToken=authentication.createToken(payloadToCreateToken);
        res.json({
            useris:users.username,
            accessToken
        });}
    else{
        res.send('Username or password incorrect');
    }
};
//view members
exports.viewmembers=function (req, res) {
    
   memberschema.get(function (err, members) {
                 if (err) {
                             res.json({
                            status: "error",
                             message: err,
                            });
                        }
                        res.json({
                            //payload:req.body,
                             status: "success",
                            message: "members retrieved successfully",
                            data: members
                             //totalchits:chitschema.count()
                        });
                    });  
               
};
//view chits
exports.viewallchits=function (req, res) {
    
    chitschema.get(function (err, chits) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            payload:req.body,
            status: "success",
            message: "chits retrieved successfully",
            data: chits
        });
    });
};
//create chits
exports.createchit= async function (req, res) {
    try
    { 
        const newchit = req.body;
        //console.log(newchit)
        chitschema.create(newchit);
        res.json({message:"success chit inserted",data:newchit})
     
     }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
};
//update chit
exports.updatechit =async function (req, res) {
    try
    { const {chitname,chitvalue}=req.body
     let chit= await  chitschema.find({chitname:chitname})
     //console.log("found chit",chit)
    if(!chit)
    {
        res.json({message:"no chit found with given:"+chitname})
    }
    else{
     let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
         {$set: {chitvalue: chitvalue}})
         let chit= await  chitschema.find({chitname:chitname})
         res.json({payload:req.body,message:"success update",data:chit})
    }
 
     }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
 //delete chit
 exports.deletechit =async function (req, res) {
    try
    { const {chitname}=req.body
     let chit= await  chitschema.find({chitname:chitname})
     //console.log("found chit",chit)
    if(!chit)
    {
        res.json({message:"no chit found with given:"+chitname})
    }
    else{
      await chitschema.findOneAndDelete({chitname:chitname})
         //let chit= await  chitschema.find({chitname:chitname})
         res.json({payload:req.body,message:"deletion success"})
    }
 
     }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };