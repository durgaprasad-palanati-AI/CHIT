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
const { response } = require('express');

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
                    else if(members.length>0)
                    {
                        if(!req.body.memid)
                        {res.json({
                            //payload:req.body,
                             status: "success",
                            message: "members retrieved successfully",
                            data: members
                            });}
                    else{
                        memberis= await memberschema.findOne({memid:req.body.memid})
                        res.json({
                             status: "success",
                            message: "member retrieved successfully",
                            data: memberis
                            });}
                    }
                    else{
                        res.json({
                           message: "members not yet created"
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
exports.viewmembershistory=async function (req, res) {
    try{
        const {chitname,mem,month}=req.body
        //console.log("memname=",chitname,mem,month)
        const role  = req.headers.role;
        if(role=='owner')
        {
        let paidmem=await chitschema.findOne({chitname:chitname})
        
        var memflag='no'
        var paiddue=''
        var payhist=[]
        //get objects of array
        if(chitname==null && month==null && mem!=null){

            let chitall=await chitschema.find({}).cursor();
            for (let doc = await chitall.next(); doc != null; doc = await chitall.next())
             {
                var monpay=''
                for(let i=0;i<doc.payment.length;i++)  {//paidmem.payment.length
                  for(let j=0;j<doc.payment[i].paid_all.length;j++){
                      
                      if(doc.payment[i].paid_all[j].mem==mem){
                          paiddue=doc.payment[i].paid_all[j].paid
                          memflag='yes'
                         }} 
                      monpay="for the chit="+doc.chitname+"-for the month="+doc.payment[i].month+"- payment is="+paiddue
                      payhist.push(monpay)         
                  }

             }

        }
         else if(chitname!=null && month!=null)
            {
                for(let i=0;i<paidmem.payment.length;i++)
                {
                    if (paidmem.payment[i].month==month){
                for(let j=0;j<paidmem.payment[i].paid_all.length;j++){
                    //console.log("paidmem.payment[i].paid_all[j]",paidmem.payment[i].paid_all[j])
                    if(paidmem.payment[i].paid_all[j].mem==mem){
                        
                       paiddue=paidmem.payment[i].paid_all[j].paid
                       memflag='yes'
                    }}}
                }
        }else if(chitname!=null && month==null){
             var monpay=''
                  for(let i=0;i<paidmem.payment.length;i++)  {//paidmem.payment.length
                    for(let j=0;j<paidmem.payment[i].paid_all.length;j++){
                        //console.log("paidmem.payment[i].paid_all[j]",paidmem.payment[i].paid_all[j])
                        if(paidmem.payment[i].paid_all[j].mem==mem){
                            paiddue=paidmem.payment[i].paid_all[j].paid
                           memflag='yes'
                        }} 
                        monpay="for the month "+paidmem.payment[i].month+" payment is "+paiddue
                        payhist.push(monpay)         
                    } }
        if(memflag=='yes'){
            if(chitname!=null && month!=null){
            res.json({message:"completed",membername:mem,Formonth:month,paid:paiddue})}
            else if(chitname!=null && month==null){
                res.json({message:"completed",membername:mem,paymenthistory:payhist}) 
            }
            else if(chitname==null && month==null && mem!=null){
                res.json({message:"completed",membername:mem,paymenthistory:payhist}) 

            }
        }else{res.json({message:"member not found",membername:mem})}
    }//
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
            else if(chits.length>0)
            {
            if(!req.body.chitname)
            {res.json({status: "success",message: "chits retrieved successfully",
            data: chits});
            }
            else{
                chitis= await chitschema.findOne({chitname:req.body.chitname})
                res.json({status: "success",message: "chit retrieved successfully",
                            data: chitis});
                        }
                    }else{res.json({message: "no chits created till now"})}
                })
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
exports.viewallactivechits=async function (req, res) {
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
            
            else if(chits.length>0)
            {
                if(!req.body.status)
                {
                    chits= await chitschema.findOne({status:req.body.status})
                    res.json({status: "success",message: "active chits are retrieved successfully",
                    data: chits});
                }
                    else{
                    chitis= await chitschema.findOne({chitname:req.body.chitname,status:req.body.status})
                    res.json({status: "success",
                                message: "active chit is retrieved successfully",
                                data: chitis});
                            }}
            else{res.json({message: "no chits created till now"});}
            })
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
        console.log(newchit)
        console.log(newchit.chitname,newchit.status,newchit.chitvalue)
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
exports.addmembertochit =async function (req, res) {
    try
    { const {chitname,chitmems}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
       chit= await chitschema.find({chitname:chitname})
     if(!chit.length)
    {res.json({message:"no chit found with given:"+chitname})    }
    else
    {  chito= await chitschema.findOne({chitname:chitname})
        var curtime=moment().format("DD-MM-YYYY")
        let cmore=ddif.moretime(curtime,chito.chitendson)
        var membs=[]
        var vmembs=[]
        for(let i = 0, l = chitmems.length; i < l; i++) 
        { mems=await memberschema.findOne({memid:chitmems[i]},{membername:1,memid:1})
           if(!mems)
            {//
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
            if (chit.chitmembers==undefined){
                chit.chitmembers=[]
                more=chit.chitsize-chit.chitmembers.length
            }
            else{more=chit.chitsize-chit.chitmembers.length}
            
            if(vmembs.length<=more){
                console.log("more=",more)          
                for (let i=0;i<vmembs.length;i++)
                        {chit.chitmembers.push(vmembs[i])}
            if ((chit.presentnumberofmembers==undefined) || (chit.presentnumberofmembers<chit.chitsize) )
            {
                more=chit.chitsize-chit.chitmembers.length
            let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitmonthsmore: cmore,chitmembers:chit.chitmembers,
                presentnumberofmembers:chit.chitmembers.length,
                numberofmemberscanbeadded:more}})
          let difference = chitmems.filter(x => !membs.includes(x));
            //add chit to member
            for(let i = 0, l = membs.length; i < l; i++) 
            { let updatedmember = await memberschema.findOneAndUpdate({memid:membs[i]},
                {$push: {inthesechits:chitname}})}
            const updatedmember2=memberschema.find().cursor();
            for (let doc = await updatedmember2.next(); doc != null; doc = await updatedmember2.next())
             {let updatedmember3 = await memberschema.findOneAndUpdate({memid:doc.memid},
                    {$set: {innumberofchits:doc.inthesechits.length}})} 
            let chitu= await  chitschema.findOne({chitname:chitname})  
            res.json({payload:req.body,message:"success update",notmembers:difference,data:chitu})
            }
        }
        else{
            del=vmembs.length-more
            if(del==1)
            {
                res.json({chit:chitname,message:"chit capacity reached"})}
                else{ res.json({chit:chitname,message:"chit capacity is not sufficient delete any "+del+"  member(s)"})}
        } 
     }}
     }else{res.json({message:"no job for u here"})}
    }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
 //update chit payments
 
exports.updatechitpayments =async function (req, res) {
    try
    { const {chitname,chitmonth,chitpaidby}=req.body
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
       const chitinst=chitmember2.chitvalue/chitmember2.chitsize//chit installment
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
                console.log("invalid members")
            res.json({message:"these members not allowed to pay:"+chitpaidby})
            }      
         else
            {  
            
            // var updatedchit = 
            if(chitmember2.payment==undefined || chitmember2.payment.length==0)
            {
                var paidinst=chitinst*vmembs.length
                console.log("chitmember2.payment",chitmember2.payment)
            await chitschema.findOneAndUpdate({chitname:chitname},
            {$push:{"payment":{month:chitmonth,paid_all:[{mem:vmembs[0],paid:'yes'}]},
            "chitpaymentdetails":[{month:chitmonth,payment:paidinst}]}})
            for (i=0;i<vmembs.length;i++){
                                
                let updatedmember3 = await memberschema.findOneAndUpdate({memid:vmembs[i]},
                    {$set: {paidchits:chitname}})
                }
            res.json({message:"chit payments success update",data:chit})
            }
            else{
                
                for(let i=0;i<chitmember2.chitperiod;i++)
                {  if(chitmember2.payment[i]!=undefined){ 
                    if(chitmember2.payment[i].month==chitmonth && chitmember2.payment[i].paid_all.length<chitmember2.chitsize)
                    {
                        for (let j=0;j<vmembs.length;j++){
                      chitmember2.payment[i].paid_all.push({mem:vmembs[j],paid:'yes'})}
                      
                      var paidinst=chitinst*chitmember2.payment[i].paid_all.length
                      chitmember2.chitpaymentdetails[i].payment=paidinst
                        await chitschema.findOneAndUpdate({chitname:chitname},
                            {$set:{payment:chitmember2.payment,chitpaymentdetails:chitmember2.chitpaymentdetails[i]}})
                            for (i=0;i<vmembs.length;i++){         
                                await memberschema.findOneAndUpdate({memid:vmembs[i]},
                                    {$set: {paidchits:chitname}})}
                            res.json({message:"chit payments success update"})  
                    } else{res.json({message:"chit payments already done"})}
                }}
                /*  */
                                        
            }}}}
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
            var chitm=[]
            var chitl=[]
                for(let i=0;i<chit.chitmembers.length;i++){
                    chitm.push(chit.chitmembers[i].mem_id)
                }
                for(let i=0;i<chit.chitliftedby.length;i++){
                    chitl.push(chit.chitliftedby[i].mem_id)
                }

            if(chitm.includes(chitliftedby) || !chitl.includes(chitliftedby)){            
            let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitliftedby:mems}})    
            }
            else{
                res.json({message:"this member not in chit"})}
            }
       }  
    chit= await chitschema.findOne({chitname:chitname})
    const chitinst=(chit.chitvalue/chit.chitsize)+1000
    
    let updatedmember3 = await memberschema.findOne({memid:chitliftedby})
    updatedmember3.chitinst.push({chitname:chitname,inst:chitinst})
    
    await memberschema.findOneAndUpdate({memid:chitliftedby},
        {$set: {liftedchits:chit,chitinst:updatedmember3.chitinst}})
    res.json({payload:req.body,message:"success update",data:chit})  
 }  else{res.json({message:"no job for u here"})}
     }
     catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
 exports.modifychit =async function (req, res) {
    try
    { const {chitname,op,opvalue}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
       chit= await chitschema.findOne({chitname:chitname})
     if(!chit)
    {res.json({message:"no chit found with given:"+chitname})}
    else
    { if(op=='CHIT VALUE')
        {
       //CHANGE chit value 
       let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
        {$set: {chitvalue:opvalue}})
        let chitu= await  chitschema.findOne({chitname:chitname})  
            res.json({message:"success update",data:chitu})

        }
        else if(op=='CHIT SIZE')
    {
        if(chit.chitmembers.length<=opvalue)
        {//CHANGE CHIT SIZE
        more=opvalue-chit.chitmembers.length
        let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitsize:opvalue,presentnumberofmembers:chit.chitmembers.length,
                numberofmemberscanbeadded:more}})
            let chitu= await  chitschema.findOne({chitname:chitname})  
                res.json({message:"success update",data:chitu})
            }else{
                res.json({message:"not allowed to update size",members:chit.chitmembers.length,updatesizevalue:opvalue})
            }

    }else if(op=='CHIT PERIOD')
    {
        //CHANGE CHIT PERIOD
        if(chit.chitpaymentdetails.length==0)
        {
        var cetime=moment().add(opvalue, 'M').subtract(1,'d').format('DD-MM-YYYY');
        let updatedchit = await chitschema.findOneAndUpdate({chitname:chitname},
            {$set: {chitperiod:opvalue,chitendson:cetime}})
            let chitu= await  chitschema.findOne({chitname:chitname})  
                res.json({message:"success update",data:chitu})
        }else{
            res.json({message:"not allowed to update now because chit payments done already"})
        }
    }
    else{
        res.json({message:"no input for modifications"})
    }

    }
}else{res.json({message:"no job for u here"})}
    }catch(err)
     {
     console.log(err)
     res.json({message:"internal error"})
     }
 };
 exports.getchitinfo =async function (req, res) {
    try
    { const {chitname,op}=req.body
    const role  = req.headers.role;
    if(role=='owner'){
       chit= await chitschema.findOne({chitname:chitname})
     if(!chit)
    {res.json({message:"no chit found with given:"+chitname})    }
    else
    { if(op=='CHIT VALUE')
    {
       //view chit value 

        let chitv= await  chitschema.findOne({chitname:chitname},{chitvalue:1})  
            res.json({message:"success",data:chitv})

    }else if(op=='CHIT SIZE')
    {
        //view CHIT SIZE
            let chitu= await  chitschema.findOne({chitname:chitname},{chitsize:1})  
                res.json({message:"success",data:chitu})
    }else if(op=='CHIT PERIOD')
    {
        //view CHIT PERIOD
            let chitu= await  chitschema.findOne({chitname:chitname},{chitperiod:1,chitstarted:1,
            chitendson:1,chitmonth:1,chitmonthsmore:1})
                res.json({message:"success",data:chitu})
    }else if(chitname!=null && op==null){
        let chitu= await  chitschema.findOne({chitname:chitname})  
                res.json({message:"success",data:chitu})
    }else if(op=='chit payments'){
        let chitu= await  chitschema.findOne({chitname:chitname},{chitpaymentdetails:1,payment:1})  
                chitdue=chit.chitvalue-chitu.chitpaymentdetails[0].payment
        res.json({message:"success",data:chitu,chitdue:chitdue})
    }
    else{
        res.json({message:"no input for modifications"})
    }

    }
}else{res.json({message:"no job for u here"})}
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
      //await chitschema.findOneAndDelete({chitname:chitname}) //deletes chit
                    /////////// without deletion//////////////////
      await chitschema.findOneAndUpdate({chitname:chitname},
        {$set: {status:"inactive"}})
         
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
            
        for(let i=0;i<dmembs.length;i++){
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