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
    try
    { 
        const role  = req.headers.role;

        if(role=='owner')
        {
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
                }
                else{
                    res.json({message:"no job for u here"})
                }}catch(err)
                {
                console.log(err)
                res.json({message:"internal error"})
                }
                    });  
               
};
//view member details monthly
exports.viewmembers4=async function (req, res) {
    try{
        const {chitname,mem,month}=req.body
        //console.log("memname=",chitname,mem,month)
        const role  = req.headers.role;
        if(role=='owner')
        {
        let paidmem=await chitschema.findOne({})
        //console.log("found doc",paidmem.payment)
        var memflag='no'
        var paiddue=''
        //get objects of array
        for(let i=0;i<paidmem.payment.length;i++)
        {
            
            if(paidmem.payment[i].month==month)
            {
                for(let j=0;j<paidmem.payment[i].paid_all.length;j++){
                    //console.log("paidmem.payment[i].paid_all[j]",paidmem.payment[i].paid_all[j])
                    if(paidmem.payment[i].paid_all[j].mem==mem){
                        
                       paiddue=paidmem.payment[i].paid_all[j].paid
                       memflag='yes'
                    }}
        }}
        if(memflag=='yes'){
            res.json({message:"completed",membername:mem,Formonth:month,paid:paiddue})
        }else{res.json({message:"member not found",membername:mem})}
    }
else{
    res.json({message:"no job for u here"})
}}catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
//view chits
exports.viewallchits=async function (req, res) {
    try
    { 
        const role  = req.headers.role;

        if(role=='owner')
        {
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
            data: chitis});}})
            }
        else{
            res.json({message:"no job for u here"})
        }
    }
        catch(err)
        {
        console.log(err)
        res.json({message:"internal error"})
        }
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
            let chitu= await  chitschema.findOne({chitname:chitname})  
            res.json({payload:req.body,message:"success update",notmembers:difference,data:chitu})
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
       
       vchitmembers=chitmember2.chitmembers
       var vchitmembs=[]
       for(let i=0;i<vchitmembers.length;i++)
       {
        vchitmembs.push(vchitmembers[i].memid)
       }
       
       let vmembs = vchitmembs.filter(x => chitpaidby.includes(x));
       //console.log("chit paid vmebs",vmembs)
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
    
    for (i=0;i<chitpaidby.length;i++){
    let updatedmember3 = await memberschema.findOneAndUpdate({memid:chitpaidby[i]},
        {$set: {paidchits:chit}})}
        chit= await chitschema.find({chitname:chitname})
 res.json({payload:req.body,message:"chit payments success update",data:chit})
    }
   
  else{res.json({message:"no job for u here"})}
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
         
      //DELETE CHIT FROM MEMBERS WHO ARE HOLDING IT
        const dmembs=[]//to delete deleted chit from these mebers
      const updatedmember4=memberschema.find().cursor();
            for (let doc = await updatedmember4.next(); doc != null; doc = await updatedmember4.next())
             {
                if (doc.inthesechits.includes(chitname)){
                //console.log("doc is=",doc.inthesechits,doc.memid,doc.inthesechits.length)
                dmembs.push(doc.memid)
                }
            } 
            //console.log("dmembs is=",dmembs)
        for(let i=0;i<dmembs.length;i++){
            
            //console.log("dmebs is=",dmembs[i])
            const holdingchit=await memberschema.findOne({memid:dmembs[i]});
            const holdingchits=holdingchit.inthesechits
            //console.log("holdingchits inthese",holdingchits)
            var delchitindex=holdingchits.indexOf(chitname)
            holdingchits.splice(delchitindex,1)
            let updatedmember5 = await memberschema.findOneAndUpdate({memid:dmembs[i]},
                {$set: {inthesechits:holdingchits,innumberofchits:holdingchits.length}})
        } 
        res.json({payload:req.body,message:"success delete",chitname:chitname,deletedfrom:dmembs})  
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