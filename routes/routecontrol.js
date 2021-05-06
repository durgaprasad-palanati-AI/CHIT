var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');//new
userschema=require('../models/chitadmin')
chitschema=require('../models/newchit')
memberschema=require('../models/member')
const Authentication = require("../auth");
const authentication = new Authentication();
const ddiff = require("./datediffunction");
const ddif = new ddiff();
var moment = require('moment');

exports.loggin=async function (req, res) {
    const { username, password,role } = req.body;
    const users = await userschema.findOne({username:username,password:password,role:role});
    if (users){
        let payloadToCreateToken = {
            username:username,
            password:password,
            role:role
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
    { //console.log("req role is=",req.headers.role)
        const role  = req.headers.role;

        if(role=='owner')
        {
        const newchit = req.body;
        //console.log(newchit)
        //console.log(newchit.chitname,newchit.chitvalue)
        chitschema.create(newchit);
        var cstime=moment().format("DD-MM-YYYY")
        var cetime=moment().add(newchit.chitperiod, 'M').subtract(1,'d').format('DD-MM-YYYY');
        let updatedchit = await chitschema.findOneAndUpdate({chitname:newchit.chitname},
            {$set: {chitstarted:cstime,chitendson:cetime}})
            
            let chit= await  chitschema.find({chitname:newchit.chitname})
            res.json({message:"success chit inserted",data:chit})
        }
        else{
            res.json({message:"no job for u here"})
        }
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
    const role  = req.headers.role;
    if(role=='owner'){
     chit= await chitschema.find({chitname:chitname})
     //console.log("found chit",chit)
    if(!chit.length)
    {
        res.json({message:"no chit found with given:"+chitname})
    }
    else{
        //console.log('from chit',chit)
        chito= await chitschema.findOne({chitname:chitname})
        //console.log('from chischema',chito.chitstarted,chito.chitendson)
        var curtime=moment().format("DD-MM-YYYY")
        let cmore=ddif.moretime(curtime,chito.chitendson)
     let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
         {$set: {chitvalue: chitvalue,chitmonthsmore: cmore}})
         let chit= await  chitschema.find({chitname:chitname})
         res.json({payload:req.body,message:"success update",data:chit})
    }
 }else{
    res.json({message:"no job for u here"})
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
    const role  = req.headers.role;
    if(role=='owner'){
     let chit= await  chitschema.find({chitname:chitname})
     //console.log("found chit",chit)
    if(!chit.length)
    {
        res.json({message:"no chit found with given:"+chitname})
    }
    else{
      await chitschema.findOneAndDelete({chitname:chitname})
         //let chit= await  chitschema.find({chitname:chitname})
         res.json({payload:req.body,message:"deletion success"})
    }
 }else{
    res.json({message:"no job for u here"})
}
     }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };