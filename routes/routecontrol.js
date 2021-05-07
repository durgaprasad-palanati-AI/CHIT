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
    
   memberschema.get(async function (err, members) {
                 if (err) {
                             res.json({
                            status: "error",
                             message: err,
                            });
                        }
                    else if(!req.body.memid)
                        {res.json({
                            //payload:req.body,
                             status: "success",
                            message: "members retrieved successfully",
                            data: members
                            });}
                    else{
                        memberis= await memberschema.findOne({memid:req.body.memid})
                        res.json({
                            payload:req.body,
                             status: "success",
                            message: "member retrieved successfully",
                            data: memberis
                            });
                    }
                    });  
               
};
//view chits
exports.viewallchits=function (req, res) {
    
    chitschema.get(async function (err, chits) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else if(!req.body.chitname)
        {res.json({
            //payload:req.body,
             status: "success",
            message: "chits retrieved successfully",
            data: chits
            });}
            else{
                chitis= await chitschema.findOne({chitname:req.body.chitname})
        res.json({
            payload:req.body,
            status: "success",
            message: "chit retrieved successfully",
            data: chitis
        });}
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
            
            const updatedmember2=memberschema.find().cursor();
            for (let doc = await updatedmember2.next(); doc != null; doc = await updatedmember2.next())
             {
                //console.log("doc is=",doc.inthesechits,doc.inthesechits.length)
                let updatedmember3 = await memberschema.findOneAndUpdate({memid:doc.memid},
                    {$set: {innumberofchits:doc.inthesechits.length}})  
            }     
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
 //update chit payments
 
exports.updatechitpayments =async function (req, res) {
    try
    { const {chitname,chitpaidby}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
     chit= await chitschema.find({chitname:chitname})
     
     //mems=await memberschema.find({memid:chitliftedby})
     
    if(!chit.length)
    {
            res.json({message:"no chit found with given:"+chitname})
    }
    else
    {   
        let chitmember2=await chitschema.findOne({chitname:chitname})
        console.log("chitmember2",chitmember2.chitmembers)
       vchitmembers=chitmember2.chitmembers
       let vmembs = chitpaidby.filter(x => !vchitmembers.includes(x));
        if(!vmembs.length)
            { 
            res.json({message:"these members not allowedto pay:"+chitliftedby})
            }      
         else
            {  
            let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitpaidby:vmembs}})    
            }
        
    }  
    chit= await chitschema.find({chitname:chitname})
    for (i=0;i<chitpaidby.length;i++){
    let updatedmember3 = await memberschema.findOneAndUpdate({memid:chitpaidby[i]},
        {$set: {paidchits:chit}})}
    res.json({payload:req.body,message:"chit payments success update"})  
 }  else{res.json({message:"no job for u here"})}
     }
     catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
 //update lifted chit
exports.updateliftedchit =async function (req, res) {
    try
    { const {chitname,chitliftedby}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
     chit= await chitschema.find({chitname:chitname})
     mems=await memberschema.find({memid:chitliftedby})
     
    if(!chit.length)
    {
            res.json({message:"no chit found with given:"+chitname})
    }
    else
    {      if(!mems.length)
            { 
            res.json({message:"no member found with given:"+chitliftedby})
            }      
         else
            {  //add member to chit
            let chit= await  chitschema.findOne({chitname:chitname})
            //console.log("chit size=",chit.chitsize)
            
            let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitliftedby:mems}})    
            }
        
    }  
    chit= await chitschema.find({chitname:chitname})
    let updatedmember3 = await memberschema.findOneAndUpdate({memid:chitliftedby},
        {$set: {liftedchits:chit}})
    res.json({payload:req.body,message:"success update",data:chit})  
 }  else{res.json({message:"no job for u here"})}
     }
     catch(err)
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