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
//create members
exports.createmembers= async function (req, res) {
    try
    { 
        const role  = req.headers.role;

        if(role=='owner')
        {
        const newmember = req.body;

        memberschema.create(newmember);
        res.json({message:"success member created",data:newmember})
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
    { const {chitname,chitvalue,chitmems}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
     chit= await chitschema.find({chitname:chitname})
     //console.log("found chit",chit)
    if(!chit.length)
    {
        res.json({message:"no chit found with given:"+chitname})
    }
    else
    {
        
        chito= await chitschema.findOne({chitname:chitname})
        var curtime=moment().format("DD-MM-YYYY")
        let cmore=ddif.moretime(curtime,chito.chitendson)
        var membs=[]
        var vmembs=[]
        for(let i = 0, l = chitmems.length; i < l; i++) 
        {
            mems=await memberschema.findOne({memid:chitmems[i]},{membername:1,memid:1})
           
             if(!mems)
            {
            // 
             }
            else{
             membs.push(mems.memid)
             vmembs.push(mems)
             }
        }
         if(!vmembs.length)
         {
            res.json({message:"no members found with given:"+chitmems})
         }
         else
         {  //add member to chit
            let chit= await  chitschema.findOne({chitname:chitname})
            //console.log("chit size=",chit.chitsize)
            more=chit.chitsize-vmembs.length
            let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitvalue: chitvalue,chitmonthsmore: cmore,chitmembers:vmembs,
                presentnumberofmembers:vmembs.length,
                numberofmemberscanbeadded:more}})
            
            
            let difference = chitmems.filter(x => !membs.includes(x));
            //add chit to member
            for(let i = 0, l = membs.length; i < l; i++) 
            { 
            let updatedmember = await memberschema.findOneAndUpdate({memid:membs[i]},
                {$push: {inthesechits:chitname}})
             }
             /*await memberschema.aggregate([{$project:
            {innumberofchits:{$size:"$inthesechits"}}}])
            */
            const updatedmember2=memberschema.find().cursor();
            for (let doc = await updatedmember2.next(); doc != null; doc = await updatedmember2.next()) {
                //console.log("doc is=",doc.inthesechits,doc.inthesechits.length)
                let updatedmember3 = await memberschema.findOneAndUpdate({memid:doc.memid},
                    {$set: {innumberofchits:doc.inthesechits.length}})
                
            }
           //console.log("inthesechits2",updatedmember2,typeof updatedmember2)
             
            res.json({payload:req.body,message:"success update",notmembers:difference,data:chit})
            
        }
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